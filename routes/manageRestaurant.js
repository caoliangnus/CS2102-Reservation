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
		res.render('manageRestaurant', { title: 'Manage Restaurant', data: data.rows, restaurantName: restaurantName,
		restaurantType: restaurantType, avgRating:avgRating});
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
