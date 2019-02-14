var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})

/* SQL Query */
var sql_query = 'SELECT * FROM users';

router.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
		res.render('admin', { title: 'Users in the system', data: data.rows });
	});
});

module.exports = router;
