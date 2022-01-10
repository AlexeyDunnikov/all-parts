function SelectCarController(connection) {
  controllerMethods = {};

  controllerMethods.getYears = function (req, res) {
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT MIN(year_from), MAX(year_to) FROM generetions",
        (err, result, fields) => {
          if (err) reject(err);
          res.send(result);
        }
      );
    });
  };

  return controllerMethods;
}

module.exports = SelectCarController;
