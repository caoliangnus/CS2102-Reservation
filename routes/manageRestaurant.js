var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//Dummy User
var restaurantName;
var restaurantType;
var avgRating;

/* SQL Query */



// GET
router.get('/', function(req, res, next) {

	var user = req.app.locals.user;

	if (user.isLogIn == false) {
		res.redirect("/login");
	}

	if (user.accountType != "Manager") {
		res.redirect("/login");
	}

var restaurantName_query = 'select restaurantName, restauranttype, avgRating from "ProjectSample".Restaurant where email = ' + "'" + user.email + "'";

	pool.query(restaurantName_query, (err, data) => {
	  restaurantName = data.rows[0].restaurantname;
	  restaurantType = data.rows[0].restauranttype;
	  avgRating = data.rows[0].avgrating;
		var meal_query = 'SELECT * FROM "ProjectSample".Meals  where restaurantname = ' + "'" + restaurantName + "'"
		 + "ORDER BY mealname asc";
      
	  pool.query(meal_query, (err, data) => {

			var meal_data = data.rows;

			var top_query = 'with numReserve as (select email, count(email) as numReserve from "ProjectSample".reservation where restaurantname = ' + "'" + restaurantName + "'"
				+ ' and status in (0, 2) group by email), numRated as (select email, count(email) as numRating from "ProjectSample".reservation where restaurantname = ' + "'" + restaurantName + "'"
			+ ' and status = 2 group by email), botht as (select A.email, numReserve, coalesce(numRating, 0) as numRating from numReserve A left join numRated B on A.email = B.email) '
			+ 'select B.email from botht B where exists(select 1 from "ProjectSample".Customer C where C.email = B.email and C.points <= 100) order by numReserve desc, numRating desc limit 3;';
		
			pool.query(top_query, (err, data) => {

				console.log(top_query)
				console.log(err)

				var top_data = data.rows;
				res.render('manageRestaurant', {
					title: 'Manage Restaurant', data: meal_data, restaurantName: restaurantName,
					restaurantType: restaurantType, avgRating: avgRating, topData: top_data
				});
			});
			
		
	  });
	});
});

// POST
router.post('/', function(req, res, next) {
	var button = req.body.submit;
	if (button == "delete") {
		var toDelete = req.body.delete;
		console.log(toDelete);
		var deleteQuery = 'delete from "ProjectSample".Meals where restaurantName = ' + "'" + restaurantName + "'" + ' and mealName = ' + "'" + toDelete + "'";
		pool.query(deleteQuery, (err, data) => {
			res.redirect('/manageRestaurant');
			
		});
		
	} else if (button == "edit") {
		var mealToEdit = req.body.originalName;
		var newName = req.body.mealname;
		var newPrice = req.body.mealprice;
	    var updatePriceQuery = 'update "ProjectSample".Meals set price = ' + "'" + newPrice + "'" + ' where mealname = ' + "'" + mealToEdit + "'";
		var updateNameQuery = 'update "ProjectSample".Meals set mealname = ' + "'" + newName + "'" + ' where mealname = ' + "'" + mealToEdit + "'";

		pool.query(updatePriceQuery, (err, data) => {
			pool.query(updateNameQuery, (err, data) => {
				res.redirect('/manageRestaurant');
			});
			
			
		});
		
	} else {
		var newMealName = req.body.newMeal;
		var newPrice = req.body.newPrice;
		var addMealQuery = 'insert into "ProjectSample".Meals(mealName, price, restaurantName) values (' + "'" + newMealName + "'"
		+ ', ' + newPrice + ', ' + "'" + restaurantName + "'" + ')';
		pool.query(addMealQuery, (err, data) => {
			res.redirect('/manageRestaurant');
		});	
	}
});


module.exports = router;
