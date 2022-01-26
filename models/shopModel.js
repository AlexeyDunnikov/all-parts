module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.getOffices = () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM offices`, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.getOfficeById = (id) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM offices WHERE id = ${id}`, (err, result, fields) => {
        if (err) reject(err);
        resolve(result[0]);
      });
    });
  };

  return modelMethods;
};
