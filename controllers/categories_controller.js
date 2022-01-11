const normalizeArr = require("../utils/normalize_arr");

function CategoriesController(connection) {
  controllerMethods = {};

  controllerMethods.renderCategory = function (req, res) {
    res.json(req.params.id);
  };

  return controllerMethods;
}

module.exports = CategoriesController;
