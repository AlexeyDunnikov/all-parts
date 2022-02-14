const validatorsModule = require("../utils/validators");
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

module.exports = (app, connection) => {
  const index = controller(connection);
  const validator = validatorsModule(connection);

  app.get("/signin", index.renderSignin);
  app.get("/signup", index.renderSignup);
  app.get("/signout", index.signout);
  app.get("/profile", authMiddleware, index.renderProfile);

  app.post("/signin", validator.signinValidators, index.signin);
  app.post("/signup", validator.signupValidators, index.signup);
  app.post("/is-user-auth", index.isUserAuth);
  app.post(
    "/add-address",
    validator.addressValidators,
    authMiddleware,
    index.addAddress
  );
  app.post(
    "/add-address-profile",
    validator.addressValidators,
    authMiddleware,
    index.addAddressProfile
  );
  app.post(
    "/add-card",
    validator.cardValidators,
    authMiddleware,
    index.addCard
  );
  app.post(
    "/add-card-profile",
    validator.cardValidators,
    authMiddleware,
    index.addCardProfile
  );
  app.post(
    "/change-email",
    validator.emailValidators,
    authMiddleware,
    index.changeEmail
  );
  app.post(
    "/change-name",
    validator.nameValidators,
    authMiddleware,
    index.changeName
  );
  app.post("/delete-card", authMiddleware, index.deleteCard);
  app.post("/delete-address", authMiddleware, index.deleteAddress);
};
