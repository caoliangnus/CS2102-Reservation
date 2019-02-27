var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
}); 

var user; 
router.get('/', function(req, res, next) {
	user = req.app.locals.user;

	if (user.isLogIn == false) {
		res.redirect("/login");
	}

	if (user.accountType != "Manager") {
		res.redirect("/login");
	}

	var display_query = 'SELECT * FROM "ProjectSample".Branch natural join "ProjectSample".Address natural join "ProjectSample".Restaurant where email = '
		+ "'" + user.email + "'" + ' order by branchId asc';

	pool.query(display_query, (err, data) => {
		res.render('manageBranch', { title: 'Restaurant Branches', data: data.rows });
	});
	
	
});

router.post('/', function(req, res, next) {
	
	var button = req.body.submit;
	console.log(button);
	if (button == "delete") {

	
	var delete_query = 'delete from "ProjectSample".Branch where postalcode = ' + "'" + req.body.delete + "'"; 
	console.log(delete_query);
	
	pool.query(delete_query, (err, data) => {
		res.redirect('/manageBranch');
	});
	} else if (button == "add") {
			
	var newAddress = req.body.newAddress;
	var newPostalCode = req.body.newPostalCode;
	var newArea = req.body.newArea;
	
	var addAddressQuery = 'insert into "ProjectSample".Address(postalcode, area, fulladdress) values (' + "'" + newPostalCode + "'" 
	+ ', ' + "'" + newArea + "'" + ', ' + "'" + newAddress + "'" + ')';
    
    var addBranchQuery = 'insert into "ProjectSample".Branch(branchId, restaurantName, postalcode) values (' +
	"(" + 'select max(branchid) from "ProjectSample".Branch natural join "ProjectSample".Restaurant where email = ' + "'" + user.email + "') + 1"
    + ', ' + '( select restaurantName from "ProjectSample".Restaurant where email = ' + "'" + user.email + "'" + '), '
    + "'" + newPostalCode + "'" + ')';

    console.log(addAddressQuery);
    console.log(addBranchQuery); 	
	
	pool.query(addAddressQuery, (err, data) => {
		console.log(err);
		pool.query(addBranchQuery, (err, data) => {
			console.log(err);
		    res.redirect('/manageBranch');
	   });
	
		
	});
	
		
	} else if (button == "edit" ) {
		
    var update_address_query = 'update "ProjectSample".Address set fulladdress = ' + "'" + req.body.address + "'" + ' where postalcode = ' + "'" + req.body.originalPostalCode +"'";
    var update_area_query = 'update "ProjectSample".Address set area = ' + "'" + req.body.area + "'" + ' where postalcode = ' + "'" + req.body.originalPostalCode + "'";
	var update_postal_query = 'update "ProjectSample".Address set postalcode = ' + "'" + req.body.postalcode + "'" + ' where postalcode = ' + "'" + req.body.originalPostalCode +"'";
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
	
		
	} else {
        var branchid = req.body.branchid;
		var restaurantQuery = 'select restaurantname from "ProjectSample".Restaurant where email = ' + "'" + user.email + "'";
		
		pool.query(restaurantQuery, (err, data) => {
			var tableQuery = 'select * from "ProjectSample".Tables where branchid = ' + "'" + branchid + "'" +
			' and restaurantname = ' + "'" + data.rows[0].restaurantname + "'";
			pool.query(tableQuery, (err, data) => {
		    res.render('manageTable', { title: 'Tables In The Branch', data: data.rows, branchid: branchid, restaurantname:data.rows[0].restaurantname});
		
	 
		
	        });
			
		});
		
		
		
	}	
	
});
	

module.exports = router;
