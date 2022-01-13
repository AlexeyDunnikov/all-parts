module.exports = (app, connection) => {
  const index = require("../controllers/userController")(connection);
  app.get("/signin", index.renderSingin);
  app.get("/signup", index.renderSingup);
};
