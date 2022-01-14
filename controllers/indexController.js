const categoriesModelModule = require("../models/categoriesModel");
const carsModelModule = require("../models/carsModel");
module.exports = (connection) => {
  const categoriesModel = categoriesModelModule(connection);
  const carsModel = carsModelModule(connection);

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
