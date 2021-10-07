const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    res.status(500).send({ message: `Error:${err}` });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (card) {
        return res.status(200).send({ message: 'Deleted' });
      }
      return res.status(404).send({ message: 'Нет карточки по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const cardLike = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        return res.status(200).send({ message: 'Liked' });
      }
      return res.status(404).send({ message: 'Нет карточки по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

const cardLikeDelete = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        return res.status(200).send({ message: 'Like deleted' });
      }
      return res.status(404).send({ message: 'Нет карточки по заданному id' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Задан некорректный id' });
      }
      return res.status(500).send({ message: `Error: ${err.name}` });
    });
};

module.exports = {
  getCards, createCard, deleteCard, cardLike, cardLikeDelete,
};
