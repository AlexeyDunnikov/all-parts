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
  };

  modelMethods.updateBasketAmount = (userId, partId, amount) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE basket SET amount = ${amount} WHERE (id_user_basket = ${userId} AND id_part_basket = ${partId})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.updateToOrderItems = (userId, partId, isAddToOrder) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE basket SET to_order = ${isAddToOrder} WHERE (id_user_basket = ${userId} AND id_part_basket = ${partId})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }; 

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

  modelMethods.getPartsFromBasket = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id AS id, parts.img, parts.price, parts.articul, parts.amount, brands.name AS brand, subcat.name AS subcat, basket.amount AS basketAmount
        FROM parts
        INNER JOIN parts_brands AS brands ON parts.id_brand = brands.id
        INNER JOIN parts_subcategories AS subcat ON parts.id_subcategory = subcat.id
        INNER JOIN basket ON basket.id_part_basket = parts.id
        WHERE basket.id_user_basket = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getPartsToOrder = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id AS id, parts.img, parts.price, parts.articul, parts.amount, brands.name AS brand, subcat.name AS subcat, basket.amount AS basketAmount
        FROM parts
        INNER JOIN parts_brands AS brands ON parts.id_brand = brands.id
        INNER JOIN parts_subcategories AS subcat ON parts.id_subcategory = subcat.id
        INNER JOIN basket ON basket.id_part_basket = parts.id
        WHERE basket.id_user_basket = ${userId} AND basket.to_order = 1`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getBasketItemsAmount = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(1) FROM basket WHERE id_user_basket = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };

  return modelMethods;
};
