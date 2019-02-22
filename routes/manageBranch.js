var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
}); 


/* SQL Query */
var display_query = 'SELECT * FROM "ProjectSample".Branch natural join "ProjectSample".Address';


router.get('/', function(req, res, next) {
	pool.query(display_query, (err, data) => {
		res.render('manageBranch', { title: 'Restaurant Branches', data: data.rows });
	});
	
	
});

router.post('/', function(req, res, next) {
	var delete_query = 'delete from "ProjectSample".Branch where postalcode = ' + "'" + req.body.delete + "'"; 
	console.log(delete_query);
	
	pool.query(delete_query, (err, data) => {
		res.redirect('/manageBranch');
	});
	
	
});
module.exports = router;
