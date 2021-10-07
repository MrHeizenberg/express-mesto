const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const PORT = 3000;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '615d9cecb11d2603068f5533',
  };

  next();
});
app.use(express.json());
app.use(userRoute);
app.use(cardRoute);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
