const normalizeArr = require("../utils/normalize_arr");

function SelectCarController(connection) {
  const CarsModel = require('../models/cars_model')(connection);

  controllerMethods = {};

  controllerMethods.getYears = async function (req, res) {
    const years = await CarsModel.getYears(req, res);
    res.json(years);
  };

  controllerMethods.getMarks = async function (req, res) {
    const marks = await CarsModel.getMarks(req, res);
    res.json(marks);
  };

  controllerMethods.getModels = async function (req, res) {
    const models = await CarsModel.getModels(req, res);
    res.json(models);
  };

  controllerMethods.getGenerations = async function (req, res) {
    const generations = await CarsModel.getGenerations(req, res);
    res.json(generations);
  };

  controllerMethods.getModifications = async function (req, res) {
    const modifications = await CarsModel.getModifications(req, res);
    res.json(modifications);
  };

  return controllerMethods;
}

module.exports = SelectCarController;
