var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
/*const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'SELECT * FROM "ProjectSample".Branch';

/*
var sql_query = 'SELECT * FROM Branch';
*/

// GET
router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
		res.render('mRestaurant', { title: 'Manage Restaurant', data: data.rows });
	});
});

module.exports = router;
