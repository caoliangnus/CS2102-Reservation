var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});



router.get('/', function(req, res, next) {
	
	if (req.body.submit == "manageTable") {
		var branchid = req.body.branchid;
		var tableQuery = 'select * from "ProjectSample".Tables where branchid = ' + "'" + branchid + "'";
		pool.query(sql_query, (err, data) => {
		res.render('manageTable', { title: 'Tables In The Branch', data: data.rows });
	});
		
		
		
	}
	
	
});

// POST
router.post('/', function(req, res, next) {
	
	
	
});

module.exports = router;
