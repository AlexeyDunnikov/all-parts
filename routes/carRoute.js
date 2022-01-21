const controller = require("../controllers/carsController");
module.exports = (app, connection) => {
  const index = controller(connection);

  app.post("/add-car-modification", index.addCarModification);

  app.post("/get-car-years", index.getYears);
  app.post("/get-car-marks", index.getMarks);
  app.post('/get-car-models', index.getModels);
  app.post("/get-car-generations", index.getGenerations);
  app.post("/get-car-modifications", index.getModifications);
  app.post("/get-car-modification-id", index.getModificationId);
  app.post("/get-car-modification-info", index.getModificationInfo);

  app.delete("/del-car-from-garage", index.delModFromGarage);
};
