const controller = require("../controllers/basketController");
const authMiddleware = require('../middleware/auth');
module.exports = (app, connection) => {
  const index = controller(connection);

  app.post("/add-to-basket", index.addToBasket);

  app.delete("/delete-from-basket", index.deleteFromBasket);
};
