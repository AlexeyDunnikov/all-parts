module.exports = (connection) => {
  const controllerMethods = {};

  controllerMethods.renderSingin = async function (req, res) {
    res.render("signin", {
      title: "Вход в аккаунт",
    });
  };

  controllerMethods.renderSingup = async function (req, res) {
    res.render("signup", {
      title: "Регистрация",
    });
  };

  return controllerMethods;
};
