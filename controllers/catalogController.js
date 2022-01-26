const catalogModelModule = require("../models/catalogModel");
const carsModelModule = require("../models/carsModel");
const TITLES = require("../keys/titles");

module.exports = (connection) => {
  const catalogModel = catalogModelModule(connection);
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderCategories = async (req, res) => {
    const options = {
      title: TITLES.CATEGORIES,
      isCatalog: true,
    };

    if (req.query.mod_id) {
      options.modId = req.query.mod_id;

      const car = await carsModel.getModificationInfo(req.query.mod_id);
      options.car = car;
    }

    res.render("categories", options);
  };

  controllerMethods.renderSubcategories = async (req, res) => {

    const subcategories = await catalogModel.getSubcategoriesByCategoryId(
      req.params.id
    );

    const categoryName = await catalogModel.getCategoryName(req.params.id);

    const options = {
      title: categoryName,
      isCatalog: true,
      categoryName,
      subcategories,
    };

    if (req.query.mod_id) {
      options.modId = req.query.mod_id;

      const car = await carsModel.getModificationInfo(req.query.mod_id);
      options.car = car[0];
    }

    res.render("subcategories", options);
  };

  controllerMethods.renderCatalog = async (req, res) => {
    const subcatId = req.params.id;

    const category = await catalogModel.getCategoryBySubcategoryId(subcatId);

    const subcategoryName = await catalogModel.getSubcategoryNameById(subcatId);

    const categoryId = category.id;
    const subcategories = await catalogModel.getSubcategoriesByCategoryId(
      categoryId
    );

    const brands = await catalogModel.getBrandsBySubcatId(subcatId);

    const minPrice = await catalogModel.getMinPriceBySubcatId(subcatId);
    const maxPrice = await catalogModel.getMaxPriceBySubcatId(subcatId);

    const minAmount = await catalogModel.getMinAmountBySubcatId(subcatId);
    const maxAmount = await catalogModel.getMaxAmountBySubcatId(subcatId);

    const options = {
      title: TITLES.CATALOG,
      isCatalog: true,
      subcategoryName,
      subcategoryId: subcatId,
      subcategories,
      brands,
      minPrice,
      maxPrice,
      minAmount,
      maxAmount,
    };

    if (req.query.mod_id) {
      const modId = req.query.mod_id;
      options.modId = modId;

      if (req.user) {
        options.parts = await catalogModel.getPartsByUserAndModIdAndSubcatId(
          req.user.id,
          modId,
          subcatId
        );
      } else {
        options.parts = await catalogModel.getPartsByModIdAndSubcatId(
          modId,
          subcatId
        );
      }

      const car = await carsModel.getModificationInfo(modId);
      options.car = car;
    } else {
      if (req.user) {
        options.parts = await catalogModel.getPartsByUserAndSubcat(
          req.user.id,
          subcatId
        );
      } else {
        options.parts = await catalogModel.getPartsBySubcatId(subcatId);
      }
    }

    res.render("catalog", options);
  };

  return controllerMethods;
};
