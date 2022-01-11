function CarsModel(connection) {
  modelMethods = {};

  modelMethods.getCarsInfo = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM cars", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.getYears = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT MIN(year_from), MAX(year_to) FROM generations",
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getMarks = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, name FROM cars WHERE id IN (SELECT DISTINCT car_id FROM car_models WHERE id IN (SELECT DISTINCT model_id FROM generations WHERE year_from <= ${req.body.year} AND year_to >= ${req.body.year})) ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModels = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT id, name FROM car_models WHERE car_id = ${req.body.markId} AND id IN (SELECT DISTINCT model_id FROM generations WHERE year_from <= ${req.body.year} AND year_to >= ${req.body.year}) ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getGenerations = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, name FROM generations WHERE model_id = ${req.body.modelId} AND  year_from <= ${req.body.year} AND year_to >= ${req.body.year} ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModifications = function (req, res) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT Concat(value, " ", horses, "л.с. / ", power, "к.в. / ", name) as name, id FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id_generation = ${req.body.generationId});
`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
}

module.exports = CarsModel;
