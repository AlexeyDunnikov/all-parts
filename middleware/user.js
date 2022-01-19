const userModelModule = require('../models/userModel')

module.exports = (connection) => {
    const userModel = userModelModule(connection)

    const middlewareMethods = {};

    middlewareMethods.user = async (req, res, next) => {
      if (!req.session.user) {
        return next();
      }

      req.user = await userModel.getUserById(req.session.user.id);
      next();
    };

    return middlewareMethods;
};
