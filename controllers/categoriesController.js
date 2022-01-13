module.exports = (connection) => {
  const controllerMethods = {};

  controllerMethods.renderCategory = (req, res) => {
    res.json(req.params.id);
  };

  return controllerMethods;
}
