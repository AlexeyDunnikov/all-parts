module.exports = function (app, connection) {
  const index = require("../controllers/categories_controller")(connection);
  app.get("/", index.render);
};
