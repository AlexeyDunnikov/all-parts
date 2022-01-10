const normalizeArr = require('../utils/normalize_arr');

function CategoriesController(connection) {
  controllerMethods = {};
  controllerMethods.render = function (req, res) {
    

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

    Promise.all([categories, subcategories]).then(
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

        res.render("index", {
          title: "Главная страница",
          isHome: true,
          categories: arr,
        });
      }
    );

  };

  controllerMethods.renderCategory = function (req, res) {
    console.log(req.params.id);
    res.json(req.params.id);
  };

  return controllerMethods;
}

module.exports = CategoriesController;
