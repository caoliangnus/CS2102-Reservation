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
var sql_query_area = 'select * from "ProjectSample".area;';


router.get('/', function (req, res, next) {
  var user = req.app.locals.user;
  console.log(user);
  var foodType;
  var area;
  // var user;
  pool.query(sql_query, (err, data) => {
    foodType = data.rows
    console.log(foodType);
    console.log(user);
	
	pool.query(sql_query_area, (err, data) => {
    area = data.rows
    console.log(area);
	res.render('index', { title: 'Home Page', user: user, foodType: foodType, area: area });
	});

  var restaurantList;
  var areaList;

  var foodType_query = 'select * from "ProjectSample".foodType;';
  var restaurantName_query = 'select restaurantName from "ProjectSample".restaurant'
  var area_query = 'select area from "ProjectSample".area'



  pool.query(foodType_query, (err, data) => {
    foodType = data.rows

    pool.query(restaurantName_query, (err, data) => {
      restaurantList = data.rows;

      pool.query(area_query, (err, data) => {
        areaList = data.rows;
        res.render('index', { title: 'Home Page', 
                              user: user, 
                              foodType: foodType, 
                              restaurantList: restaurantList,
                              areaList: areaList });

      })

    })

  });
  
});

// POST
router.post('/logout', function (req, res, next) {
  var user = req.app.locals.user;
  user.isLogIn = false;
  req.app.locals.user = user;
  res.redirect('/');

});


// POST
router.post('/manage', function (req, res, next) {
  res.redirect('/manageBooking')
});

// POST
router.post('/searchResult', function (req, res, next) {

  console.log("Searching");

  var date = req.body.date;
  var time = req.body.time;
  var people = req.body.people;  
  var restaurant = req.body.restaurant;
  var locations = req.body.location;
  var type = req.body.type;

  console.log(date);
  console.log(time);
  console.log(people);
  console.log(restaurant);
  console.log(locations);
  console.log(type);

  res.redirect('/searchResult')
});

module.exports = router;
