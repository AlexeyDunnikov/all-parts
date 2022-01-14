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
          resolve(result);
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

  modelMethods.getSubcategoriesWhereId = (id) => {
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

  return modelMethods;
};
