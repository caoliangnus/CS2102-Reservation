var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
// GET query
var getType_query = 'select * from "ProjectSample".foodType;';
//POST query
var postUsers_query = 'insert into "ProjectSample".users values'
var postManager_query = 'insert into "ProjectSample".manager values'
var postRestaurant_query = 'insert into "ProjectSample".restaurant values'

router.get('/', function (req, res, next) {
    var foodType;
    pool.query(getType_query, (err, data) => {
        foodType = data.rows
        console.log(foodType);
        res.render('rSignup', { title: 'Sign up', foodType: foodType });
    });

});

// POST
router.post('/', function (req, res, next) {

    // Retrieve Information
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var restaurant = req.body.restaurant;
    var openTime = req.body.openTime + ":00";
    var closeTime = req.body.closeTime + ":00";
    var cuisine = req.body.type;

    console.log(username);
    console.log(email);
    console.log(password);
    console.log(restaurant);
    console.log(openTime);
    console.log(closeTime);
    console.log(cuisine);


    var openTimeObj = new Date(openTime);

     // Construct Specific SQL Query
	var insertManages = 'insert into "ProjectSample".Manages (email, restaurantname) values ( ' + "'" + email + "'" + ', ' + "'" + restaurant + "'" + ')';
    var insert_users = postUsers_query + "('" + email + "','" + password + "','" + username + "'," + "'Manager'" + ");";    
    var insert_restaurant = 'insert into "ProjectSample".Restaurant(restaurantName, email, avgRating, openingTime,closingTime,restaurantType) values' +
        "(" + "'" + restaurant + "','" + email + "', " + 0.0 + ", '" + openTime + "', '" + closeTime +"', '" + 
            cuisine + "');";
        

    pool.query(insertManages, (err, data) => {

    pool.query(insert_users, (err, data) => {

        pool.query(insert_restaurant, (err, data) => {
            var user = {
                name: username,
                email: email,
                accountType: "Manager",
                isLogIn: true
            }
            req.app.locals.user = user;
            res.redirect('/manageRestaurant');
        });		
    });
    });

});

module.exports = router;
