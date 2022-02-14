const controller = require("../controllers/pagesController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get('/about', index.renderAbout);
};
