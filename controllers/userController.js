const userModelModule = require("../models/userModel");
const orderModelModule = require("../models/orderModel");
const carsModelModule = require("../models/carsModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const TITLES = require("../keys/titles");
const normalizeArr = require("../utils/normalizeArr");

module.exports = (connection) => {
  const userModel = userModelModule(connection);
  const orderModel = orderModelModule(connection);
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.renderSignin = async (req, res) => {
    res.render("signin", {
      title: TITLES.SIGNIN,
      signinError: req.flash("signinError"),
    });
  };

  controllerMethods.renderSignup = async (req, res) => {
    res.render("signup", {
      title: TITLES.SIGNUP,
      signupError: req.flash("signupError"),
    });
  };

  controllerMethods.renderProfile = async (req, res) => {
    try {
      const userInfo = await userModel.getUserById(req.user.id);

      const cards = await userModel.getCards(req.user.id);
      const addresses = await userModel.getAddresses(req.user.id);

      let orders = await orderModel.getOrdersInfoByUserId(req.user.id);
      orders = normalizeArr(orders, "id");

      const orderParts = await orderModel.getPartsInUserOrders(req.user.id);
      let boughtPartsAmount = 0;
      let totalSpent = 0;

      orderParts.forEach((orderPart) => {
        boughtPartsAmount += orderPart.amount;
        orderPart.totalPrice = orderPart.amount * orderPart.price;
        totalSpent += orderPart.totalPrice;

        const orderId = orderPart.order_id;
        if (!orders[orderId].parts) {
          orders[orderId].parts = [];
        }
        if (!orders[orderId].total) {
          orders[orderId].total = 0;
        }
        orders[orderId].parts.push(orderPart);
        orders[orderId].total += orderPart.totalPrice;
      });

      const ordersArr = [];
      for (const value of Object.values(orders)) {
        ordersArr.push(value);
      }

      ordersArr.reverse();

      const garage = await carsModel.getCarsInfoFromGarageByUser(req.user.id);
      res.render("profile", {
        title: TITLES.PROFILE,
        userInfo,
        cards,
        addresses,
        boughtPartsAmount,
        totalSpent,
        garage,
        ordersArr,
        profileError: req.flash("profileError"),
      });
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.signout = async (req, res) => {
    req.session.destroy(() => {
      res.redirect("/signin");
    });
  };

  controllerMethods.signin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const candidate = await userModel.getUserByEmail(email);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("signinError", errors.array()[0].msg);
        return res.status(422).redirect("/signin");
      }

      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        const user = candidate;
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("signinError", "Неверный пароль");
        res.redirect("/signin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.signup = async (req, res) => {
    try {
      const { email, name, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("signupError", errors.array()[0].msg);
        return res.status(422).redirect("/signup");
      }

      const hashPassword = await bcrypt.hash(password, 10);

      await userModel.createUser({
        email,
        name,
        password: hashPassword,
      });

      res.redirect("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.addAddress = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("addressError", errors.array()[0].msg);
        return res.status(422).redirect("/select-delivery");
      }

      let addressId = await userModel.getAddressId(req.user.id, req.body);

      if (!addressId) {
        const address = await userModel.addAddress(req.user.id, req.body);
        addressId = address.insertId;
      }

      res.redirect(`/select-pay?addressId=${addressId}`);
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.addAddressProfile = async (req, res) => {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("profileError", errors.array()[0].msg);
        return res.status(422).redirect("/profile");
      }

      const addressId = await userModel.getAddressId(req.user.id, req.body);

      if (!addressId) {
        await userModel.addAddress(req.user.id, req.body);
      }

      res.redirect('/profile');
    }catch(err){
      console.log(err);
    }
  }

  controllerMethods.deleteAddress = async (req, res) => {
    try {
      const addressId = req.body.addressId;

      await userModel.deleteAddress(addressId);
      res.redirect("/profile#addresses");
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.addCard = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("cardError", errors.array()[0].msg);
        if (req.body.addressId)
          return res
            .status(422)
            .redirect(`/select-pay?addressId=${req.body.addressId}`);
        if (req.body.officeId)
          return res
            .status(422)
            .redirect(`/select-pay?officeId=${req.body.officeId}`);
      }

      let cardId = await userModel.getCardId(req.user.id, req.body);

      if (!cardId) {
        const card = await userModel.addCard(req.user.id, req.body);
        cardId = card.insertId;
      }

      if (req.body.addressId) {
        res.redirect(
          `/confirm-order?addressId=${req.body.addressId}&cardId=${cardId}`
        );
      } else if (req.body.officeId) {
        res.redirect(
          `/confirm-order?officeId=${req.body.officeId}&cardId=${cardId}`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.addCardProfile = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("profileError", errors.array()[0].msg);
        return res.status(422).redirect(`/profile`);
      }

      let cardId = await userModel.getCardId(req.user.id, req.body);

      if (!cardId) {
        const card = await userModel.addCard(req.user.id, req.body);
        cardId = card.insertId;
      }

      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  };
  
  controllerMethods.deleteCard = async (req, res) => {
    try {
      const cardId = req.body.cardId;

      await userModel.deleteCard(cardId);
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.changeEmail = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("profileError", errors.array()[0].msg);
        return res.status(422).redirect("/profile");
      }

      await userModel.changeEmailByUserId(req.user.id, req.body.email);
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.changeName = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("profileError", errors.array()[0].msg);
        return res.status(422).redirect("/profile");
      }

      await userModel.changeNameByUserId(req.user.id, req.body.name);
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.isUserAuth = (req, res) => {
    req.session.user ? res.json(true) : res.json(false);
  };

  return controllerMethods;
};
