const normalizeArr = require("../utils/normalizeArr");

module.exports = (connection) => {
  modelMethods = {};
  modelMethods.getCategoriesAndSubcategories = () => {
    const categories = new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM parts_categories",
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    const subcategories = new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM parts_subcategories`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    return Promise.all([categories, subcategories]).then(
      ([categories, subcategories]) => {
        const categoriesList = normalizeArr(categories);

        const subcategoriesList = normalizeArr(subcategories);

        for (let key of Object.keys(subcategoriesList)) {
          if (
            !categoriesList[subcategoriesList[key].id_category].subcategories
          ) {
            categoriesList[subcategoriesList[key].id_category].subcategories =
              [];
          }
          categoriesList[subcategoriesList[key].id_category].subcategories.push(
            subcategoriesList[key]
          );
        }

        const arr = [];
        for (let key in categoriesList) {
          arr.push(categoriesList[key]);
        }

        return arr;
      }
    );
  };

  return modelMethods;
}
