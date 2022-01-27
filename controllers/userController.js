const userModelModule = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const TITLES = require('../keys/titles');

module.exports = (connection) => {
  const userModel = userModelModule(connection);

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

      userModel.createUser({
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
      let addressId = await userModel.getAddressId(req.user.id, req.body);

      if (!addressId){
        const address = await userModel.addAddress(req.user.id, req.body);
        addressId = address.insertId;
      }

      res.redirect(`/select-pay?addressId=${addressId}`);
    } catch (err) {
      console.log(err);
    }
  };

  controllerMethods.addCard = async (req, res) => {
    try{
      let cardId = await userModel.getCardId(req.user.id, req.body);

      if(!cardId){
        await userModel.addCard(req.user.id, req.body);
        cardId = await userModel.getCardId(req.user.id, req.body);
      }

      if(req.body.addressId){
        res.redirect(
          `/confirm-order?addressId=${req.body.addressId}&cardId=${cardId}`
        );
      }else if(req.body.officeId){
        res.redirect(
          `/confirm-order?officeId=${req.body.officeId}&cardId=${cardId}`
        );
      }

    }catch(err){
      console.log(err);
    }
  }

  controllerMethods.isUserAuth = (req, res) => {
    req.session.user ? res.json(true) : res.json(false);
  };

  return controllerMethods;
};
