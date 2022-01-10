module.exports = function (app, connection) {
  const index = require("../controllers/select_car_controller")(connection);

  app.post("/get-car-years", index.getYears);
};
