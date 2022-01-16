const normalizeArr = require("../utils/normalizeArr");

module.exports = (connection) => {
  const modelMethods = {};
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
  }

  modelMethods.getCategoriesAndSubcategories = async function () {
    let categories = await this.getCategories();
    const subcategories = await this.getSubcategories();

    categories = normalizeArr(categories, "id");

    subcategories.forEach((subcategory) => {
      const catId = subcategory.id_category;
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
        INNER JOIN parts_subcategories AS subcat 
        ON parts.id_subcategory = subcat.id
        INNER JOIN parts_brands AS brand
        ON parts.id_brand = brand.id
        WHERE subcat.id = ${subcatId}
        ORDER BY brand.name;`,
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
        `SELECT MIN(parts.price)
          FROM parts
          INNER JOIN parts_subcategories AS subcat ON subcat.id = parts.id_subcategory
          WHERE subcat.id = ${subcatId}`,
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
        `SELECT MAX(parts.price)
          FROM parts
          INNER JOIN parts_subcategories AS subcat ON subcat.id = parts.id_subcategory
          WHERE subcat.id = ${subcatId}`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(Object.values(result[0])[0]);
        }
      );
    });
  };
  return modelMethods;
};
