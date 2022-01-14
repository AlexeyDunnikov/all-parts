const controller = require("../controllers/catalogController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get("/catalog", index.renderCatalog);
  // app.get("/catalog/categories/:id", index.renderCategories);
  // app.get("/catalog/categories/:id", index.renderCategories);
};
