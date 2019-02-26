var express = require('express');
var router = express.Router();
const url = require('url');    


const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


/* GET home page. */
// router.get('/', function (req, res, next) {
//   var user = req.app.locals.user;
//   res.render('index', { title: 'Home Page', user: user});
// });


router.get('/', function (req, res, next) {
  var user = req.app.locals.user;
  console.log(user);
  var foodType;
  var restaurantList;
  var areaList;

  var foodType_query = 'select * from "ProjectSample".foodtype;';
  var restaurantName_query = 'select restaurantName from "ProjectSample".restaurant'
  var area_query = 'select area from "ProjectSample".area'



  pool.query(foodType_query, (err, data) => {
	console.log(err);
	console.log(data);
    foodType = data.rows;

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
  var user = req.app.locals.user;
  if (user.isLogIn == false) {
    res.redirect("/login");
  } else if (user.accountType == "Customer") {
    res.redirect('/manageBooking')
  } else if (user.accountType == "Manager") {
    res.redirect('/manageRestaurant')
  } 


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
  
  var searchInfo = {
    date : date,
    time : time,
    people : people,
    restaurant : restaurant,
    locations : locations,
    type : type
  }

  res.redirect(url.format({
    pathname: "/searchResult",
    query: searchInfo
  }));

});

module.exports = router;
