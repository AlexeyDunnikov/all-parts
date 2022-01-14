const categoriesModelModule = require("../models/categoriesModel");
const carsModelModule = require("../models/carsModel");
module.exports = (connection) => {
  const categoriesModel = categoriesModelModule(connection);
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderCatalog = async (req, res) => {
    const categories = await categoriesModel.getCategoriesAndSubcategories();

    const options = {
      title: "Каталог",
      isCatalog: true,
      categories,
    };

    if (req.query.mod_id) {
      options.modId = req.query.mod_id;

      const car = await carsModel.getModificationInfo(req.query.mod_id);
      options.car = car[0];
    }

    res.render("catalog", options);
  };

  return controllerMethods;
};
