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

  validatorMethods.addressValidators = [
    body("town", "Минимальная длина названия города должна быть 3 символа")
      .isLength({
        min: 3,
        max: 54,
      })
      .trim(),

    body("street", "Минимальная длина названия улицы должна быть 3 символа")
      .isLength({
        min: 3,
        max: 54,
      })
      .trim(),

    body("house", "Номер дома должен быть в числовом формате")
      .isNumeric()
      .isLength({
        min: 1,
        max: 4,
      })
      .trim(),

    body("house", "Номер квартиры должен быть в числовом формате")
      .isNumeric()
      .isLength({
        min: 0,
        max: 4,
      })
      .trim(),
  ];

  validatorMethods.cardValidators = [
    body("cardNumber", "Длина номера катры должна быть 16")
      .isNumeric()
      .isLength({ min: 16, max: 16 }),
    body("cardDate", "Введите корректную дату карты").isLength({
      min: 5,
      max: 5,
    }),
    body("cvv", "Введите корректный cvv")
      .isNumeric()
      .isLength({ min: 3, max: 3 }),
  ];

  validatorMethods.emailValidators = [
    body("email", "Введите корректный e-mail")
      .isEmail()
      .custom(async (value, { req }) => {
        try {
          const user = await userModel.getUserByEmail(value);
          if (user) {
            return Promise.reject("Пользователь с таким e-mail уже существует");
          }
          return true;
        } catch (err) {
          console.log(err);
        }
      })
      .normalizeEmail(),
  ];

  validatorMethods.nameValidators = [
    body("name", "Минимальная длина имени должна быть 3 символа")
      .isLength({ min: 3 })
      .trim(),
  ];

  return validatorMethods;
};
