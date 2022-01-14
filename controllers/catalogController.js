const categoriesModelModule = require("../models/categoriesModel");
module.exports = (connection) => {
  const categoriesModel = categoriesModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderCatalog = async (req, res) => {
      const categories = await categoriesModel.           getCategoriesAndSubcategories();

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
