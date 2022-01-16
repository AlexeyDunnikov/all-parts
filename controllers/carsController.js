const carsModelModule = require("../models/carsModel");
module.exports = (connection) => {
  const carsModel = carsModelModule(connection);

  const controllerMethods = {};

  controllerMethods.getYears = async (req, res) => {
    const years = await carsModel.getYears();
    res.json(years);
  };

  controllerMethods.getMarks = async (req, res) => {
    const marks = await carsModel.getMarks(req.body.year);
    res.json(marks);
  };

  controllerMethods.getModels = async (req, res) => {
    const models = await carsModel.getModels(req.body.year, req.body.markId);
    res.json(models);
  };

  controllerMethods.getGenerations = async (req, res) => {
    const generations = await carsModel.getGenerations(
      req.body.year,
      req.body.modelId
    );
    res.json(generations);
  };

  controllerMethods.getModifications = async (req, res) => {
    const modifications = await carsModel.getModifications(
      req.body.generationId
    );
    res.json(modifications);
  };

  controllerMethods.getModificationId = async (req, res) => {
    const result = await carsModel.getModificationId(
      req.body.generationId,
      req.body.engineId,
    );
    const modificationId = result[0].id;

    res.json(modificationId);
  };

  controllerMethods.getModificationInfo = async (req, res) => {
    const result = await carsModel.getModificationInfo(req.body.modificationId);

    res.json(result);
  };

  return controllerMethods;
};
