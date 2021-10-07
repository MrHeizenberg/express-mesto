const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    res.status(500).send({ message: `Error: ${err.name}` });
  });

const getUser = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: 'Нет пользователя по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: 'Нет пользователя по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: 'Нет пользователя по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
};
