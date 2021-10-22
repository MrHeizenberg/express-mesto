const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateUserAvatar, getAuthUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/user/me', getAuthUser);
router.get('/users/:userId', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp('^https?://[a-z]{1,}')),
  }),
}), updateUserAvatar);

module.exports = router;
