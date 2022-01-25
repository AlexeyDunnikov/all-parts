const catalogModelModule = require("../models/catalogModel");

const carsModelModule = require("../models/carsModel");
const TITLES = require("../keys/titles");

module.exports = (connection) => {
  const catalogModel = catalogModelModule(connection);
  const carsModel = carsModelModule(connection);


  const controllerMethods = {};

  controllerMethods.render = async (req, res) => {
    const cars = await carsModel.getAllCars(req, res);

    const garage = [];

    const options = {
      title: TITLES.MAIN,
      isHome: true,
      cars,
      garage,
    };

    if (req.user) {
      const carsModificationsId =
        await carsModel.getCarsModFromGarageWhereUserId(req.user.id);

      for (const modId of carsModificationsId) {
        const car = await carsModel.getModificationInfo(modId);
        garage.push(car);
      }
      options.garage = garage.reverse();
    }

    res.render("index", options);
  };

  return controllerMethods;
};
