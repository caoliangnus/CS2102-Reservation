var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query = 'SELECT * FROM "ProjectSample".users';

router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
		res.render('admin', { title: 'Users in the system', data: data.rows });
	});
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var email  = req.body.delete;
	
	
	// Construct Specific SQL Query
	var delete_query = 'DELETE FROM "ProjectSample".users WHERE email = ' + "'" + email + "'";
	console.log(delete_query);
		
	
	pool.query(delete_query, (err, data) => {
		console.log(err);
		res.redirect('/admin');
		
	});
});

module.exports = router;
