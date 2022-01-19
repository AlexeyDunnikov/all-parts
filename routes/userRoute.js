const validatorsModule = require("../utils/validators");
const controller = require("../controllers/userController");

module.exports = (app, connection) => {
  const index = controller(connection);
  const validator = validatorsModule(connection);

  app.get("/signin", index.renderSignin);
  app.get("/signup", index.renderSignup);
  app.get("/signout", index.signout);

  app.post("/signin", validator.signinValidators, index.signin);
  app.post("/signup", validator.signupValidators, index.signup);
};
