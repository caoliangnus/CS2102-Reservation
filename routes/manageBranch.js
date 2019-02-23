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
	var button = req.body.submit;
	if (button == "delete") { 
	
	var delete_query = 'delete from "ProjectSample".Branch where postalcode = ' + "'" + req.body.delete + "'"; 
	console.log(delete_query);
	
	pool.query(delete_query, (err, data) => {
		res.redirect('/manageBranch');
	});
	
	} else {
	
    var update_address_query = 'update "ProjectSample".Address set fulladdress = ' + "'" + req.body.address + "'" + ' where postalcode = ' + "'" + req.body.edit +"'";
    var update_area_query = 'update "ProjectSample".Address set area = ' + "'" + req.body.area + "'" + ' where postalcode = ' + "'" + req.body.edit + "'";
	var update_postal_query = 'update "ProjectSample".Address set postalcode = ' + "'" + req.body.postalcode + "'" + ' where postalcode = ' + "'" + req.body.edit +"'";
	console.log(update_address_query);
	console.log(update_area_query);
	console.log(update_postal_query);
	

  	pool.query(update_address_query, (err, data) => {
		console.log(err);
		pool.query(update_area_query, (err, data) => {
			console.log(err);
			pool.query(update_postal_query, (err, data) => {
				console.log(err);
		        res.redirect('/manageBranch');
	});
			
		
	});
	});
		
		
		
	}
	
	
});
module.exports = router;
