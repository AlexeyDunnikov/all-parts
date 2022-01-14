const catalogModelModule = require("../models/catalogModel");
const carsModelModule = require("../models/carsModel");

module.exports = (connection) => {

  const catalogModel = catalogModelModule(connection);
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderCategories = async (req, res) => {
    const categories = await catalogModel.getCategoriesAndSubcategories();

    const options = {
      title: "Категории товаров",
      isCatalog: true,
      categories,
    };

    if (req.query.mod_id) {
      options.modId = req.query.mod_id;

      const car = await carsModel.getModificationInfo(req.query.mod_id);
      options.car = car[0];
    }

    res.render("categories", options);
  };

  controllerMethods.renderSubcategories = async (req, res) => {
    const categories = await catalogModel.getCategoriesAndSubcategories();

    const subcategories = await catalogModel.getSubcategoriesWhereId(req.params.id);

    const categoryName = await catalogModel.getCategoryName(req.params.id);

    const options = {
      title: "Категории товаров",
      isCatalog: true,
      categories,
      categoryName: categoryName[0],
      subcategories,
    };

    if (req.query.mod_id) {
      options.modId = req.query.mod_id;

      const car = await carsModel.getModificationInfo(req.query.mod_id);
      options.car = car[0];
    }

    res.render("subcategories", options);
  };

  return controllerMethods;
};
