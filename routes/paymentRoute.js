const controller = require("../controllers/pagesController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get('/payment', index.renderPayment);
};
