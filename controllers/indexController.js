const catalogModelModule = require("../models/catalogModel");

const carsModelModule = require("../models/carsModel");
const TITLES = require("../keys/titles");

module.exports = (connection) => {
  const catalogModel = catalogModelModule(connection);
  const carsModel = carsModelModule(connection);


  const controllerMethods = {};

  controllerMethods.render = async (req, res) => {
    const cars = await carsModel.getAllCars();
    const categories = await catalogModel.getCategories();

    const garage = [];

    const options = {
      title: TITLES.MAIN,
      isHome: true,
      cars,
      categories,
      garage,
    };

    if (req.user) {
      const cars = await carsModel.getCarsInfoFromGarageByUser(req.user.id);

      options.garage = cars.reverse();
    }

    res.render("index", options);
  };

  return controllerMethods;
};
