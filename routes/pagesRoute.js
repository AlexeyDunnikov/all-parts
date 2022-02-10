const controller = require("../controllers/pagesController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get("/delivery", index.renderDelivery);
  app.get('/payment', index.renderPayment);
  app.get('/about', index.renderAbout);
  app.get('/garanty', index.renderGaranty)
};
