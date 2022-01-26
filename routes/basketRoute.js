const controller = require("../controllers/basketController");
const authMiddleware = require("../middleware/auth");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.get("/basket", authMiddleware, index.renderBasket);
  app.get("/select-delivery", authMiddleware, index.renderDelivery);
  app.get("/select-pay", authMiddleware, index.renderPay);
  app.get("/confirm-order", authMiddleware, index.renderConfirmOrder);

  app.post("/add-to-basket", index.addToBasket);
  app.post("/confirm-order", authMiddleware, index.confirmOrder);

  app.delete("/delete-from-basket", index.deleteFromBasket);

  app.put("/update-basket-amount", authMiddleware, index.updateBasketAmount);
  app.put("/update-to-order-items", authMiddleware, index.updateToOrderItems);
};
