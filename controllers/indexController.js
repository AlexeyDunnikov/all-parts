const catalogModelModule = require("../models/catalogModel");
const carsModelModule = require("../models/carsModel");
module.exports = (connection) => {
  const catalogModel = catalogModelModule(connection);
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.render = async (req, res) => {
    let categories = await catalogModel.getCategoriesAndSubcategories();

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
