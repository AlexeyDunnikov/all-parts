const DELIVERY_TYPE = require("../keys/deliveryTypes");

module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.addOrder = (
    userId,
    date,
    { deliveryType, deliveryAddressId, note }
  ) => {
    return new Promise((resolve, reject) => {
      let sqlStr;
      if (deliveryType === DELIVERY_TYPE.COURIER) {
        sqlStr = `INSERT INTO orders (id_user_order, date, notes, delivery_type, id_user_address_orders) VALUES (${userId}, "${date}", "${note}", "${deliveryType}", ${deliveryAddressId});`;
      } else if (deliveryType === DELIVERY_TYPE.PICKUP) {
        sqlStr = `INSERT INTO orders (id_user_order, date, notes, delivery_type, id_office_orders) VALUES (${userId}, "${date}", "${note}", "${deliveryType}", ${deliveryAddressId});`;
      }
      connection.query(sqlStr, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  modelMethods.addPartToOrder = (orderId, partId, amount) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO parts_to_order (id_order_pto, id_part_pto, amount) VALUES (${orderId}, ${partId}, ${amount})`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
};
