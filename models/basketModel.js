module.exports = (connection) => {
  modelMethods = {};

  modelMethods.addPartToBasket = (userId, partId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO basket (id_user_basket, id_part_basket) VALUES ('${userId}', '${partId}')`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.delPartFromBasket = (userId, partId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM basket WHERE (id_user_basket = ${userId} AND id_part_basket = ${partId});`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
 }

  modelMethods.getBasketIdFromUserAndPart = (userId, partId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT id FROM basket WHERE id_user_basket = ${userId} AND id_part_basket = ${partId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  return modelMethods;
};
