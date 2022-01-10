const express = require("express");
const mysql = require("mysql");
const path = require("path");
const exphbs = require("express-handlebars");

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

//Connection to mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "allparts",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

require("./routes/home")(app, connection);
require("./routes/categories")(app, connection);
require("./routes/select_car")(app, connection);

//const homeRoutes = require("./routes/home");
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function normalizeArr(arr) {
  const res = {};

  arr = JSON.parse(JSON.stringify(arr));

  arr.forEach((item) => {
    res[item.id] = item;
  });

  return res;
}
