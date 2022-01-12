module.exports = (app, connection) => {
  const index = require("../controllers/categoriesController")(connection);
  app.get("/categories/:id", index.renderCategory);
};
