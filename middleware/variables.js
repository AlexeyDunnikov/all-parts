const basketModelModule = require("../models/basketModel");
const catalogModelModule = require("../models/catalogModel");

module.exports = (connection) => {
  const catalogModel = catalogModelModule(connection);
  const basketModel = basketModelModule(connection);

  middlewareMethods = {};

  middlewareMethods.isAuth = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;

    next();
  };

  middlewareMethods.basketAmount = async (req, res, next) => {
    if (req.user) {
      const amount = await basketModel.getBasketItemsAmount(req.user.id);
      res.locals.basketAmount = amount;
    }

    next();
  };

  middlewareMethods.categoriesList = async (req, res, next) => {
    const categoriesList = await catalogModel.getCategoriesAndSubcategories();
    res.locals.categories = categoriesList;
    next();
  };

  return middlewareMethods;
};
