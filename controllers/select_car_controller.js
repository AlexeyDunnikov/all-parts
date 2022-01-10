const normalizeArr = require("../utils/normalize_arr");

function SelectCarController(connection) {
  controllerMethods = {};

  controllerMethods.getYears = function (req, res) {
    connection.query(
      "SELECT MIN(year_from), MAX(year_to) FROM generations",
      (err, result, fields) => {
        if (err) throw err;
        res.json(result);
      }
    );
  };

  controllerMethods.getMarks = function (req, res) {
    connection.query(
      `SELECT id, name FROM cars WHERE id IN (SELECT DISTINCT car_id FROM car_models WHERE id IN (SELECT DISTINCT model_id FROM generations WHERE year_from <= ${req.body.year} AND year_to >= ${req.body.year})) ORDER BY name`,
      (err, result, fields) => {
        if (err) throw err;
        res.json(result);
      }
    );
  };

  controllerMethods.getModels = function (req, res) {
    connection.query(
      `SELECT DISTINCT id, name FROM car_models WHERE car_id = ${req.body.markId} AND id IN (SELECT DISTINCT model_id FROM generations WHERE year_from <= ${req.body.year} AND year_to >= ${req.body.year}) ORDER BY name`,
      (err, result, fields) => {
        if (err) throw err;
        res.json(result);
      }
    );
  };

  controllerMethods.getGenerations = function (req, res) {
    connection.query(
      `SELECT id, name FROM generations WHERE model_id = ${req.body.modelId} AND  year_from <= ${req.body.year} AND year_to >= ${req.body.year} ORDER BY name`,
      (err, result, fields) => {
        if (err) throw err;
        res.json(result);
      }
    );
  };

  controllerMethods.getModifications = function (req, res) {
    connection.query(
      `SELECT Concat(value, " ", horses, "л.с. / ", power, "к.в. / ", name) as name FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id_generation = ${req.body.generationId});
`,
      (err, result, fields) => {
        if (err) throw err;
        res.json(result);
      }
    );
  };

  return controllerMethods;
}

module.exports = SelectCarController;
