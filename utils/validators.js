const userModelModule = require("../models/userModel");
const { body } = require("express-validator");
module.exports = (connection) => {
  const validatorMethods = {};

  const userModel = userModelModule(connection);

  validatorMethods.signinValidators = [
    body("email", "Введите корректный e-mail")
      .isEmail()
      .custom(async (value, { req }) => {
        try {
          const user = await userModel.getUserByEmail(value);
          if (!user) {
            return Promise.reject("Пользователя с таким e-mail не существует");
          }
        } catch (err) {
          console.log(err);
        }
      })
      .normalizeEmail(),

    body("password", "Минимальная длина пароля должна быть 5 символов")
      .isLength({ min: 5, max: 56 })
      .isAlphanumeric()
      .trim(),
  ];

  validatorMethods.signupValidators = [
    body("email", "Введите корректный e-mail")
      .isEmail()
      .custom(async (value, { req }) => {
        try {
          const user = await userModel.getUserByEmail(value);
          if (user) {
            return Promise.reject("Пользователь с таким e-mail уже существует");
          }
        } catch (err) {
          console.log(err);
        }
      })
      .normalizeEmail(),

    body("name", "Минимальная длина имени должна быть 3 символа")
      .isLength({ min: 3 })
      .trim(),

    body("password", "Минимальная длина пароля должна быть 5 символов")
      .isLength({ min: 5, max: 54 })
      .isAlphanumeric()
      .trim(),

    body("password-confirm")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Пароли должны совпадать");
        }
        return true;
      })
      .trim(),
  ];

  return validatorMethods;
};
