module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.getAllCars = (req, res) => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM car_marks", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.getYears = (req, res) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT MIN(year_from), MAX(year_to) FROM car_generations",
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
        `SELECT DISTINCT marks.id, marks.name FROM car_marks AS marks 
        INNER JOIN car_models AS models ON marks.id = models.car_id
        INNER JOIN car_generations AS gen ON models.id = gen.model_id
        WHERE year_from <= ${req.body.year} AND year_to >= ${req.body.year} 
        ORDER BY name`,
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
        `SELECT DISTINCT model.id, model.name 
        FROM car_generations AS gen INNER JOIN car_models AS model 
        ON model.id = gen.model_id 
        WHERE gen.year_from <= ${req.body.year} AND gen.year_to >= ${req.body.year} AND model.car_id = ${req.body.markId}
        ORDER BY name`,
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
        `SELECT id, name FROM car_generations WHERE model_id = ${req.body.modelId} AND  year_from <= ${req.body.year} AND year_to >= ${req.body.year} ORDER BY name`,
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
        `SELECT Concat(e.value, " ", e.horses, "л.с. / ", e.power, "к.в. / ", e.name) AS name, e.id 
        FROM car_engines AS e 
        INNER JOIN car_modifications AS m 
        ON e.id = m.id_engine 
        WHERE m.id_generation = ${req.body.generationId};
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
        `SELECT DISTINCT id 
        FROM car_modifications 
        WHERE id_generation = ${req.body.generationId} AND id_engine = ${req.body.engineId}`,
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
        `SELECT marks.name AS mark, models.name AS model, gen.name AS generation, gen.img AS img, gen.year_from AS year_from, gen.year_to AS year_to, engines.name AS engine_name, engines.power AS engine_power, engines.horses AS engine_horses, engines.value AS engine_value
        FROM car_marks AS marks 
        INNER JOIN car_models AS models ON marks.id = models.car_id
        INNER JOIN car_generations AS gen ON models.id = gen.model_id
        INNER JOIN car_modifications AS modifications ON gen.id = modifications.id_generation
        INNER JOIN car_engines AS engines ON engines.id = modifications.id_engine
        WHERE modifications.id = ${req.body.modificationId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
};
