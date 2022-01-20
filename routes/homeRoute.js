const controller = require("../controllers/indexController");
module.exports = (app, connection) => {
  const index = controller(connection)

  app.get("/", index.render);
};
