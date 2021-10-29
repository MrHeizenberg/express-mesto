require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { login, createUser } = require('./controllers/users');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];
const PORT = 3000;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(requestLogger);
app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }
  next();
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(new RegExp('^https?://[a-z]{1,}')),
  }),
}), createUser);
app.use(auth);
app.use(userRoute);
app.use(cardRoute);
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
/* eslint no-unused-vars: ["error", { "args": "none" }] */
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
