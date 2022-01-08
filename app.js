const express = require("express");
const mysql = require("mysql");
const path = require("path");
const exphbs = require("express-handlebars");

const homeRoutes = require("./routes/home");

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

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Registration rotes
// app.use("/", homeRoutes);

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

app.get("/", (req, res) => {
  let categoriesList = {};

  const categories = new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM parts_categories",
      (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  })

  const subcategories = new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM parts_subcategories`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

  Promise.all([categories, subcategories]).then(([categories, subcategories]) => {
    const categoriesList = normalizeArr(categories);

    const subcategoriesList = normalizeArr(subcategories);

    for (let key of Object.keys(subcategoriesList)) {
      if (!categoriesList[subcategoriesList[key].id_category].subcategories) {
        categoriesList[subcategoriesList[key].id_category].subcategories = [];
      }
      categoriesList[subcategoriesList[key].id_category].subcategories.push(
        subcategoriesList[key]
      );
    }

    const arr = [];
    for (let key in categoriesList){
      arr.push(categoriesList[key]);
    }

    console.log(arr);

    res.render("index", {
      title: "Главная страница",
      isHome: true,
      categories: arr,
    });
  });
});
