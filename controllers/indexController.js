module.exports = (connection) => {
  const CategoriesModel = require("../models/categoriesModel")(connection);
  const carsModel = require('../models/carsModel')(connection);

  controllerMethods = {};
  controllerMethods.render = async function (req, res) {
    const categories = await CategoriesModel.getCategoriesAndSubcategories();

    const cars = await carsModel.getCarsInfo(req, res);

    res.render("index", {
      title: "Главная страница",
      isHome: true,
      categories,
      cars: JSON.parse(JSON.stringify(cars)),
    });
  };

  return controllerMethods;
}

