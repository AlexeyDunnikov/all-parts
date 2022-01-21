const basketModelModule = require("../models/basketModel");

module.exports = (connection) => {
  const basketModel = basketModelModule(connection);

  const controllerMethods = {};

  controllerMethods.addToBasket = async (req, res) => {
    try {
      const { partId } = req.body;

      const userId = req.user.id;

      await basketModel.addPartToBasket(userId, partId);

      res.end();
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.deleteFromBasket = async (req, res) => {
    try {

      const { partId } = req.body;
      const userId = req.user.id;

      await basketModel.delPartFromBasket(userId, partId);

      res.end();
    } catch (err) {
      console.log(err);
    }
  };

  return controllerMethods;
};
