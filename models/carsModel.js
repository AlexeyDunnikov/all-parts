module.exports = (connection) => {
  modelMethods = {};

  modelMethods.getCarsInfo = (req, res) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM cars", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.getYears = (req, res) => {
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

  modelMethods.getMarks = (req, res) => {
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

  modelMethods.getModels = (req, res) => {
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

  modelMethods.getGenerations = (req, res) => {
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

  modelMethods.getModifications = (req, res) => {
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

  modelMethods.getModificationId = (req, res) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT id FROM modifications WHERE id_generation = ${req.body.generationId} AND id_engine = ${req.body.engineId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModificationInfo = (req, res) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT
	(SELECT name FROM cars WHERE id IN(SELECT car_id FROM car_models WHERE id IN(SELECT model_id FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId})))) AS mark,
    (SELECT name FROM car_models WHERE id IN(SELECT model_id FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId}))) AS model,
    (SELECT name FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId})) AS generation,
    (SELECT img FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId})) AS img,
    (SELECT year_from FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId})) AS year_from,
    (SELECT year_to FROM generations WHERE id IN(SELECT id_generation FROM modifications WHERE id = ${req.body.modificationId})) AS year_to,
    (SELECT name FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id = ${req.body.modificationId})) AS engine_name,
    (SELECT power FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id = ${req.body.modificationId})) AS engine_power,
    (SELECT horses FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id = ${req.body.modificationId})) AS engine_horses,
    (SELECT value FROM engines WHERE id IN(SELECT id_engine FROM modifications WHERE id = ${req.body.modificationId})) AS engine_value`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
};
