const DELIVERY_TYPE = require("../keys/deliveryTypes");
const PAYMENT_TYPE = require('../keys/paymentTypes');

module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.addOrder = (userId, date, body) => {
    return new Promise((resolve, reject) => {
      let addressField = "";
      if (body.deliveryType === DELIVERY_TYPE.COURIER) {
        addressField = "id_user_address_orders";
      } else if (body.deliveryType === DELIVERY_TYPE.PICKUP) {
        addressField = "id_office_orders";
      }

      let cardId = "";
      if(body.paymentType === PAYMENT_TYPE.CARD){
        cardId = body.cardId;
      }

      connection.query(
        `
        INSERT INTO orders (id_user_orders, date, notes, delivery_type, ${addressField}, payment_type, id_card_orders) VALUES (${userId}, "${date}", "${body.note}", "${body.deliveryType}", ${body.deliveryAddressId}, "${body.paymentType}", ${cardId});
      `,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
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

  modelMethods.getOrdersInfoByUserId = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT orders.id, orders.date, orders.notes, orders.delivery_type, 
offices.town AS office_town, offices.street AS office_street, offices.house AS office_house, offices.flat AS office_flat, offices.from_time AS office_from_time,
offices.to_time AS office_to_time, offices.from_day AS office_from_day, offices.to_day AS office_to_day,
user_addresses.town AS user_town, user_addresses.street AS user_street, user_addresses.house AS user_house, user_addresses.flat AS user_flat,
orders.payment_type,
cards.num AS card_num, cards.month AS card_month, cards.year AS card_year FROM orders 
LEFT JOIN offices ON offices.id = orders.id_office_orders
LEFT JOIN user_addresses ON user_addresses.id = orders.id_user_address_orders
LEFT JOIN user_cards AS cards ON cards.id = orders.id_card_orders
WHERE orders.id_user_orders = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getPartsInUserOrders = (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id AS id, parts.img, parts.price, parts.articul, brands.name AS brand, subcat.name AS subcat, pto.amount AS amount, pto.id_order_pto AS order_id
        FROM parts_to_order AS pto
        INNER JOIN orders ON pto.id_order_pto = orders.id
        INNER JOIN parts ON pto.id_part_pto = parts.id
        INNER JOIN parts_brands AS brands ON parts.id_brand = brands.id
        INNER JOIN parts_subcategories AS subcat ON parts.id_subcategory = subcat.id
        WHERE orders.id_user_orders = ${userId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  return modelMethods;
};
