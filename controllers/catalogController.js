module.exports = (connection) => {
  const CategoriesModel = require("../models/categoriesModel")(connection);

  const controllerMethods = {};

  controllerMethods.renderCatalog = async (req, res) => {
      const categories = await CategoriesModel.           getCategoriesAndSubcategories();

      const options = {
        title: "Каталог",
        isCatalog: true,
        categories,  
      };

      if (req.query.mod_id) options.modId = req.query.mod_id
      
      res.render("catalog", options);
  };

  return controllerMethods;
};
