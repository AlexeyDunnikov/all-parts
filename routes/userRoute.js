const controller = require("../controllers/userController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get("/signin", index.renderSingin);
  app.get("/signup", index.renderSingup);
};
