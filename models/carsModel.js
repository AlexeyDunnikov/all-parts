module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.addCarModificationToUser = (userId, modId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO garage (id_user_garage, id_car_mod_garage) VALUES ('${userId}', '${modId}')`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  modelMethods.delModFromGarage = (userId, modId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM garage WHERE (id_user_garage = ${userId} AND id_car_mod_garage = ${modId})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  modelMethods.getAllCars = () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM car_marks", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.getYears = () => {
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

  modelMethods.getMarks = (year) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT marks.id, marks.name FROM car_marks AS marks 
        INNER JOIN car_models AS models ON marks.id = models.car_id
        INNER JOIN car_generations AS gen ON models.id = gen.model_id
        WHERE year_from <= ${year} AND year_to >= ${year} 
        ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModels = (year, markId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT model.id, model.name 
        FROM car_generations AS gen INNER JOIN car_models AS model 
        ON model.id = gen.model_id 
        WHERE gen.year_from <= ${year} AND gen.year_to >= ${year} AND model.car_id = ${markId}
        ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getGenerations = (year, modelId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id, name FROM car_generations WHERE model_id = ${modelId} AND  year_from <= ${year} AND year_to >= ${year} ORDER BY name`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModifications = (generationId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT Concat(e.value, " ", e.horses, "л.с. / ", e.power, "к.в. / ", e.name) AS name, e.id 
        FROM car_engines AS e 
        INNER JOIN car_modifications AS m 
        ON e.id = m.id_engine 
        WHERE m.id_generation = ${generationId};
`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModificationId = (generationId, engineId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT id 
        FROM car_modifications 
        WHERE id_generation = ${generationId} AND id_engine = ${engineId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getModificationInfo = (modificationId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT modifications.id AS id, marks.name AS mark, models.name AS model, gen.name AS generation, gen.img AS img, gen.year_from AS year_from, gen.year_to AS year_to, engines.name AS engine_name, engines.power AS engine_power, engines.horses AS engine_horses, engines.value AS engine_value
        FROM car_marks AS marks 
        INNER JOIN car_models AS models ON marks.id = models.car_id
        INNER JOIN car_generations AS gen ON models.id = gen.model_id
        INNER JOIN car_modifications AS modifications ON gen.id = modifications.id_generation
        INNER JOIN car_engines AS engines ON engines.id = modifications.id_engine
        WHERE modifications.id = ${modificationId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.getCarsModFromGarageWhereUserId = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id_car_mod_garage FROM garage WHERE id_user_garage = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          const carsModId = result.map((car) => car.id_car_mod_garage);
          resolve(carsModId);
        }
      );
    });
  };

  return modelMethods;
};
