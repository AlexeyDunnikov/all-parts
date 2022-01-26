const basketModelModule = require("../models/basketModel");
const userModelModule = require("../models/userModel");
const shopModelModule = require("../models/shopModel");
const orderModelModule = require("../models/orderModel");
const TITLES = require("../keys/titles");

module.exports = (connection) => {
  const basketModel = basketModelModule(connection);
  const userModel = userModelModule(connection);
  const shopModel = shopModelModule(connection);
  const orderModel = orderModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderBasket = async (req, res) => {
    const basket = await basketModel.getPartsFromBasket(req.user.id);
    await basketModel.setDefaultParts(req.user.id);

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
    try {
      const userId = req.user.id;

      const addresses = await userModel.getAddresses(userId);
      const offices = await shopModel.getOffices();

      res.render("select-delivery", {
        title: TITLES.DELIVERY_TYPE,
        addresses,
        offices,
      });
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.renderPay = async (req, res) => {
    try {
      const userId = req.user.id;

      const cards = await userModel.getCards(userId);

      const options = {
        title: TITLES.SELECT_PAY,
        cards,
      };

      if (req.query.addressId) {
        options.addressId = req.query.addressId;
      } else if (req.query.officeId) {
        options.officeId = req.query.officeId;
      }

      res.render("select-pay", options);
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.renderConfirmOrder = async (req, res) => {
    try {
      const basketItems = await basketModel.getPartsToOrder(req.user.id);

      const user = await userModel.getUserById(req.user.id);

      const totalPrice = basketItems.reduce((acc, item) => {
        return (acc += item.price * item.basketAmount);
      }, 0);

      const options = {
        title: TITLES.CONFIRM_ORDER,
        user,
        basketItems,
        totalPrice,
      };

      if (req.query.addressId) {
        const address = await userModel.getAddressInfoById(req.query.addressId);
        options.address = address;
      } else if (req.query.officeId) {
        const office = await shopModel.getOfficeById(req.query.officeId);
        options.office = office;
      }

      if (req.query.cardId) {
        const card = await userModel.getCardInfoById(req.query.cardId);
        options.card = card;
      }

      res.render("confirm-order", options);
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.confirmOrder = async (req, res) => {
    try {
      console.log(req.body);
      const { deliveryType, deliveryAddressId, note } = req.body;

      const date = new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date());

      console.log(date);

      const order = await orderModel.addOrder(req.user.id, date, req.body);
      const orderId = order.insertId;

      const partsToOrder = await basketModel.getPartsToOrderIdAndAmount(req.user.id);

      for (const partToOrder of partsToOrder) {
        await orderModel.addPartToOrder(
          orderId,
          partToOrder.id,
          partToOrder.amount
        );
      }

      await basketModel.delPartsToOrder(req.user.id);

      res.redirect('/');

    } catch (err) {
      console.log(err);
    }
  };

  return controllerMethods;
};
