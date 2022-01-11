module.exports = function (app, connection) {
  const index = require("../controllers/index_controller")(connection);
  app.get("/", index.render);
};
