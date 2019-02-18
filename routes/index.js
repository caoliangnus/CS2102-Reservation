var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


/* GET home page. */
// router.get('/', function (req, res, next) {
//   var user = req.app.locals.user;
//   res.render('index', { title: 'Home Page', user: user});
// });


/* SQL Query */
var sql_query = 'select * from "ProjectSample".foodType;';
var sql_query_2 = 'SELECT * FROM "ProjectSample".customer;';


router.get('/', function (req, res, next) {
  var user = req.app.locals.user;
  var foodType;
  // var user;

  pool.query(sql_query, (err, data) => {
    foodType = data.rows
    console.log(foodType);
    console.log(user);
    res.render('index', { title: 'Home Page', user: user, foodType: foodType });

  });

  // pool.query(sql_query_2, (err, data) => {
  //   user = data.rows
  // });




});

// POST
router.post('/logOut', function (req, res, next) {
  var user = req.app.locals.user;
  user.isLogIn = false;
  req.app.locals.user = user;
  res.render('index', { title: 'Home Page', user: user });
});


module.exports = router;
