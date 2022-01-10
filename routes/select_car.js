module.exports = function (app, connection) {
  const index = require("../controllers/select_car_controller")(connection);

  app.post("/get-car-years", index.getYears);
  app.post("/get-car-marks", index.getMarks);
  app.post('/get-car-models', index.getModels);
  app.post("/get-car-generations", index.getGenerations);
  app.post("/get-car-modifications", index.getModifications);
};
