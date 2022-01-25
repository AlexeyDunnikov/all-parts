const basketModelModule = require("../models/basketModel");
const userModelModule = require('../models/userModel');
const TITLES = require("../keys/titles");

module.exports = (connection) => {
  const basketModel = basketModelModule(connection);
  const userModel = userModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderBasket = async (req, res) => {
    const basket = await basketModel.getPartsFromBasket(req.user.id);

    res.render("basket", {
      title: TITLES.BASKET,
      basket,
    });
  };

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

  controllerMethods.updateBasketAmount = async (req, res) => {
    try {
      const { partId, amount } = req.body;
      const userId = req.user.id;

      await basketModel.updateBasketAmount(userId, partId, amount);

      res.end();
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.updateToOrderItems = async (req, res) => {
    try {
      const { partId, isAddToOrder } = req.body;
      const userId = req.user.id;

      await basketModel.updateToOrderItems(userId, partId, isAddToOrder);

      res.end();
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.renderDelivery = async (req, res) => {
    try{
      const userId = req.user.id;

      const addresses = await userModel.getAddresses(userId);

      res.render('select-delivery', {
        title: TITLES.DELIVERY_TYPE,
        addresses,
      });
    }catch(err){
      console.log(err);
    }
  }

  controllerMethods.renderPay = async (req, res) => {
    try {
      const userId = req.user.id;

      const options = {
        title: TITLES.SELECT_PAY,
      };

      if (req.query.addressId){
        options.addressId = req.query.addressId;
      }

      res.render("select-pay", options);
    } catch (err) {
      console.log(err);
    }
  }

  return controllerMethods;
};
