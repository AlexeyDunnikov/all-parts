const basketModelModule = require('../models/basketModel');

module.exports = (connection) => {
    const basketModel = basketModelModule(connection);

  const controllerMethods = {};

  controllerMethods.addToBasket = async (req, res, next) => {
    try {
        const { partId, subcategoryId} = req.body;
        const userId = req.user.id;

        console.log(partId, subcategoryId);

        const result = await basketModel.addPartToBasket(userId, partId);
        res.json(result);
    } catch (err) {
      console.log(err);
    }
    
  };

  return controllerMethods;
};
