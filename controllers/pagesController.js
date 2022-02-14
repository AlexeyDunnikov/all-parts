const TITLES = require('../keys/titles');

module.exports = (connection) => {
  const controllerMethods = {};

  controllerMethods.renderDelivery = (req, res) => {
    res.render("delivery", {
      title: TITLES.DELIVERY,
      isDelivery: true,
    });
  };

  controllerMethods.renderPayment = (req, res) => {
    res.render("payment", {
      title: TITLES.PAYMENT,
      isPayment: true,
    });
  };

  controllerMethods.renderAbout = (req, res) => {
    res.render("about", {
      title: TITLES.ABOUT,
      isAbout: true,
    });
  };

  controllerMethods.renderGaranty = (req, res) => {
    res.render("garanty", {
      title: TITLES.GUARANTEE,
      isGaranty: true,
    });
  };

  return controllerMethods;
};
