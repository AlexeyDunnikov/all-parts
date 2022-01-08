// const { Router } = require("express");
// const router = Router();

// router.get("/", (req, res) => {
//   const categories = new Promise((resolve, reject) => {
//     connection.query(
//       "SELECT * FROM parts_categories",
//       (err, result, fields) => {
//         if (err) reject(err);
//         resolve(result);
//       }
//     );
//   });

//   Promise.all([categories]).then((value) => {
//     console.log(value);
//     res.render("index", {
//       title: "Главная страница",
//       isHome: true,
//     });
//   });
// });

// module.exports = router;
