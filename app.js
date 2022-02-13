const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const flash = require('connect-flash');
const exphbs = require("express-handlebars");
const session = require("express-session");
const keys = require("./keys/keys");

const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");

const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();
app.use(express.json());

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

//const homeRoutes = require("./routes/home");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

//Middlewares
app.use(userMiddleware(connection).user);
app.use(varMiddleware(connection).isAuth);
app.use(varMiddleware(connection).basketAmount);
app.use(varMiddleware(connection).categoriesList);

//Routes
require("./routes/deliveryRoute")(app, connection);
require("./routes/paymentRoute")(app, connection);
require("./routes/aboutRoute")(app, connection);
require("./routes/guaranteeRoute")(app, connection);
require("./routes/homeRoute")(app, connection);
require("./routes/carRoute")(app, connection);
require("./routes/userRoute")(app, connection);
require("./routes/catalogRoute")(app, connection);
require("./routes/basketRoute")(app, connection);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

