module.exports = (connection) => {
  const carsModel = require('../models/carsModel')(connection);

  const controllerMethods = {};

  controllerMethods.getYears = async (req, res) => {
    const years = await carsModel.getYears(req, res);
    res.json(years);
  };

  controllerMethods.getMarks = async (req, res) => {
    const marks = await carsModel.getMarks(req, res);
    res.json(marks);
  };

  controllerMethods.getModels = async (req, res) => {
    const models = await carsModel.getModels(req, res);
    res.json(models);
  };

  controllerMethods.getGenerations = async (req, res) => {
    const generations = await carsModel.getGenerations(req, res);
    res.json(generations);
  };

  controllerMethods.getModifications = async (req, res) => {
    const modifications = await carsModel.getModifications(req, res);
    res.json(modifications);
  };

  controllerMethods.getModificationId = async (req, res) => {
    const result = await carsModel.getModificationId(req, res);
    const modificationId = result[0].id;

    res.json(modificationId)
  }
  
  controllerMethods.getModificationInfo = async (req, res) => {
    const result = await carsModel.getModificationInfo(req, res);

    res.json(result[0]);
  };

  return controllerMethods;
}
