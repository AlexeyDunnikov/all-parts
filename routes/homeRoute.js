module.exports = (app, connection) => {
  const index = require("../controllers/indexController")(connection);
  app.get("/", index.render);
};
