const normalizeArr = require("../utils/normalizeArr");

module.exports = (connection) => {
  const modelMethods = {};

  modelMethods.getPartInfoById = (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brand.name AS brand, subcat.name AS subcategory FROM parts 
        INNER JOIN parts_brands AS brand ON parts.id_brand = brand.id
        INNER JOIN parts_subcategories AS subcat ON subcat.id = parts.id_subcategory
        WHERE parts.id = ${id}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.getPartInfoByIdAndUser = (id, userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brand.name AS brand, subcat.name AS subcategory, basket.id_user_basket AS user_id FROM parts 
        LEFT JOIN (
          SELECT * FROM basket WHERE basket.id_user_basket = ${userId}
        ) AS basket ON basket.id_part_basket = parts.id
        INNER JOIN parts_brands AS brand ON parts.id_brand = brand.id
        INNER JOIN parts_subcategories AS subcat ON subcat.id = parts.id_subcategory
        WHERE parts.id = ${id}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.getCategories = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM parts_categories",
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getCategoryName = (catId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT name FROM parts_categories WHERE id = ${catId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0].name);
        }
      );
    });
  };

  modelMethods.getCategoryBySubcategoryId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT cat.id, cat.name 
        FROM parts_categories AS cat
        INNER JOIN parts_subcategories AS subcat 
        ON cat.id = subcat.id_category
        WHERE subcat.id = ${subcatId};`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  };

  modelMethods.getSubcategories = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM parts_subcategories`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getSubcategoriesByCategoryId = (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM parts_subcategories WHERE id_category = ${id}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getSubcategoryNameById = (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT name FROM parts_subcategories WHERE id = ${id}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0].name);
        }
      );
    });
  };

  modelMethods.getCategoriesAndSubcategories = async function () {
    let categories = await this.getCategories();
    const subcategories = await this.getSubcategories();

    if (categories.length > 5) {
      categories = categories.slice(0, 5);
    }
    categories = normalizeArr(categories, "id");

    subcategories.forEach((subcategory) => {
      const catId = subcategory.id_category;
      if (!categories[catId]) return;
      if (!categories[catId].subcategories) {
        categories[catId].subcategories = [];
      }
      categories[catId].subcategories.push(subcategory);
    });

    const catArr = [];
    for (let key in categories) {
      catArr.push(categories[key]);
    }
    return catArr;
  };

  modelMethods.getPartsBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brand.name AS brand
        FROM parts
        INNER JOIN parts_brands AS brand
        ON parts.id_brand = brand.id
        WHERE parts.id_subcategory = ${subcatId}
        ORDER BY parts.price;`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getPartsByUserAndSubcat = (userId, subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brand.name AS brand, basket.id_user_basket AS user_id FROM parts
        INNER JOIN parts_brands AS brand ON parts.id_brand = brand.id
        LEFT JOIN (
          SELECT * FROM basket WHERE basket.id_user_basket = ${userId}
        ) AS basket ON basket.id_part_basket = parts.id
        WHERE parts.id_subcategory = ${subcatId}
        ORDER BY parts.price;`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getPartsByModIdAndSubcatId = (modId, subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brands.name AS brand
        FROM parts_to_modifications AS parts_to_mod
        INNER JOIN parts ON parts_to_mod.id_part = parts.id
        INNER JOIN parts_brands AS brands ON parts.id_brand = brands.id
        WHERE parts.id_subcategory = ${subcatId} AND parts_to_mod.id_modification = ${modId} ORDER BY parts.price`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getPartsByUserAndModIdAndSubcatId = (
    userId,
    modId,
    subcatId
  ) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT parts.id, parts.img, parts.price, parts.articul, parts.amount, brand.name AS brand, basket.id_user_basket AS user_id
        FROM parts_to_modifications AS parts_to_mod
        INNER JOIN parts ON parts_to_mod.id_part = parts.id
        INNER JOIN parts_brands AS brand ON parts.id_brand = brand.id
        LEFT JOIN (
          SELECT * FROM basket WHERE basket.id_user_basket = ${userId}
        ) AS basket ON basket.id_part_basket = parts.id
        WHERE parts.id_subcategory = ${subcatId} AND parts_to_mod.id_modification = ${modId} ORDER BY parts.price`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getBrandsBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DISTINCT brands.id, brands.name
            FROM parts_brands AS brands
            INNER JOIN parts ON brands.id = parts.id_brand
            INNER JOIN parts_subcategories AS subcat ON subcat.id = parts.id_subcategory
            WHERE subcat.id = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  };

  modelMethods.getMinPriceBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT MIN(price)
          FROM parts
          WHERE id_subcategory = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };

  modelMethods.getMaxPriceBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT MAX(price)
          FROM parts
          WHERE id_subcategory = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };

  modelMethods.getMinAmountBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT MIN(amount)
          FROM parts
          WHERE id_subcategory = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };

  modelMethods.getMaxAmountBySubcatId = (subcatId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT MAX(amount)
          FROM parts
          WHERE id_subcategory = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };

  return modelMethods;
};
