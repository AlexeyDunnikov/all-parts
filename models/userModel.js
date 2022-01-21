module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE email = "${email}"`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE id = ${id}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  }

  modelMethods.createUser = ({ email, name, password }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO users (email, name, password) VALUES ("${email}", "${name}", "${password}");`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };


  return modelMethods;
};
