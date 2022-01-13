module.exports = (connection) => {
  const CategoriesModel = require("../models/categoriesModel")(connection);

  const controllerMethods = {};

  controllerMethods.renderCatalog = async (req, res) => {
      const categories = await CategoriesModel.getCategoriesAndSubcategories();

      res.render("catalog", {
        title: "Каталог",
        isCatalog: true,
        categories,
      });
  };

  return controllerMethods;
};
