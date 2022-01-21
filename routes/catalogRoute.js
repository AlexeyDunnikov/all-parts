const controller = require("../controllers/catalogController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get("/categories", index.renderCategories);
  app.get("/categories/:id", index.renderSubcategories);
  app.get("/subcategories/:id", index.renderCatalog);
};
