module.exports = (app, connection) => {
  const index = require("../controllers/catalogController")(connection);

  app.get("/catalog", index.renderCatalog);
};
