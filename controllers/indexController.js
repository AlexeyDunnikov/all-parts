module.exports = (connection) => {
  const categoriesModel = require("../models/categoriesModel")(connection);
  const carsModel = require("../models/carsModel")(connection);

  const controllerMethods = {};

  controllerMethods.render = async (req, res) => {
    let categories = await categoriesModel.getCategoriesAndSubcategories();

    const cars = await carsModel.getAllCars(req, res);

    res.render("index", {
      title: "Главная страница",
      isHome: true,
      categories,
      cars,
    });
  };

  return controllerMethods;
};
