const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");

const homeRoutes = require('./routes/home');

const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
//app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Registration rotes
app.use("/", homeRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
