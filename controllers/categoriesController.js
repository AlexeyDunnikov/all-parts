module.exports = (connection) => {
  controllerMethods = {};

  controllerMethods.renderCategory = function (req, res) {
    res.json(req.params.id);
  };

  return controllerMethods;
}
