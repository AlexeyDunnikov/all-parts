function IndexController(connection) {
  const CategoriesModel = require("../models/categories_model")(connection);
  const CarsModel = require('../models/cars_model')(connection);

  controllerMethods = {};
  controllerMethods.render = async function (req, res) {
    const categories = await CategoriesModel.getCategoriesAndSubcategories();

    const cars = await CarsModel.getCarsInfo(req, res);

    res.render("index", {
      title: "Главная страница",
      isHome: true,
      categories,
      cars: JSON.parse(JSON.stringify(cars)),
    });
  };

  return controllerMethods;
}

module.exports = IndexController;
