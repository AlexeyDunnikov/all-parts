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
  };

  modelMethods.getAddresses = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user_addresses WHERE id_user_addresses = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getAddressInfoById = (addressId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user_addresses WHERE id = ${addressId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

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

  modelMethods.getAddressId = (userId, { town, street, house, flat }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id FROM user_addresses WHERE id_user_addresses = ${userId} AND town = "${town}" AND street = "${street}" AND house = "${house}" AND flat = "${flat}"`,
        (err, result, fields) => {
          if (err) reject(err);

          if (result.length === 0) resolve(undefined);
          else resolve(result[0].id);
        }
      );
    });
  };

  modelMethods.addAddress = (userId, { town, street, house, flat }) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO user_addresses (id_user_addresses, town, street, house, flat) VALUES("${userId}", "${town}", "${street}", "${house}", "${flat}")`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getCardId = (userId, { cardNumber, cardDate, cvv }) => {
    const [month, year] = cardDate.split("/");

    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id FROM user_cards WHERE id_user_cards = ${userId} AND num = ${cardNumber} AND month = ${month} AND year = ${year} AND cvv = ${cvv}`,
        (err, result, fields) => {
          if (err) reject(err);

          if (result.length === 0) resolve(undefined);
          else resolve(result[0].id);
        }
      );
    });
  };

  modelMethods.getCards = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user_cards WHERE id_user_cards = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getCardInfoById = (cardId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user_cards WHERE id = ${cardId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.addCard = (userId, { cardNumber, cardDate, cvv }) => {
    const [month, year] = cardDate.split("/");

    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO user_cards (id_user_cards, num, month, year, cvv) VALUES(${userId}, "${cardNumber}", "${month}", "${year}", "${cvv}")`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result)
        }
      );
    });
  };

  modelMethods.changeEmailByUserId = (userId, newEmail) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET email = "${newEmail}" WHERE (id = ${userId})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  modelMethods.changeNameByUserId = (userId, newName) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET name = "${newName}" WHERE (id = ${userId})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
};
