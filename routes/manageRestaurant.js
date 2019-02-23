var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//Dummy User
var user = {email: 'm1@gmail.com'};

/* SQL Query */
var sql_query = 'SELECT * FROM "ProjectSample".Meals natural join "ProjectSample".Restaurant where email = ' + "'" + user.email + "'";

// GET
router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
    res.render('manageRestaurant', { title: 'Manage Restaurant', data: data.rows });
	});
});

module.exports = router;
