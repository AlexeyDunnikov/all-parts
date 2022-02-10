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
  app.post("/add-address", validator.addressValidators, authMiddleware, index.addAddress);
  app.post("/add-card", validator.cardValidators, authMiddleware, index.addCard);
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
};
