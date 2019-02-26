var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


var user;
var restaurantname;
var branchid;

router.get('/', function(req, res, next) {
	 

		
		});

// POST
router.post('/', function(req, res, next) {
	user = req.app.locals.user;
	
	var button = req.body.submit;
	
	
	if (button == "addTable") {
       var capacity = req.body.capacity;
	   var branchid = req.body.branchid;
	   
	   var restaurantname = req.body.restaurantname;
	   
	   var insertQuery = 'insert into "ProjectSample".Tables (tableid, capacity, branchid, restaurantname) values ( '
	   + req.body.tableid + ', ' + capacity + ', ' + branchid + ', ' +  "'" + restaurantname + "'" +  ')';
	   console.log(insertQuery);
	   pool.query(insertQuery, (err, data)=> {
		   console.log(err);
		var findQuery = 'select * from "ProjectSample".Tables where restaurantname = ' + "'" + restaurantname + "'" + ' and branchid  = ' + "'" + branchid + "'";
		pool.query(findQuery, (err, data)=> {
	    res.render('manageTable', { title: 'Tables In The Branch', data: data.rows, branchid: branchid, restaurantname:restaurantname});
			
			
		});
		
		
		   
	   });
		
		
	} else if (button = "delete") {
		var data1 = {tableid:req.body.deletetableid, branchid:req.body.deletebranchid, restaurantname:req.body.deleterestaurantname};
		var deleteQuery = 'delete from "ProjectSample".Tables where tableid = ' + data1.tableid + ' and restaurantname = ' + "'" + data1.restaurantname + "'"
		+ ' and branchid = ' + data1.branchid;
        console.log(deleteQuery);
        pool.query(deleteQuery, (err, data) => {
        console.log(err);
		
		var findQuery = 'select * from "ProjectSample".Tables where restaurantname = ' + "'" + data1.restaurantname + "'" + ' and branchid  = ' 
		+ "'" + data1.branchid + "'";
		console.log(findQuery);
		pool.query(findQuery, (err, data)=> {
			  console.log(err);
			  res.render('manageTable', { title: 'Tables In The Branch', data: data.rows, branchid: data1.branchid, restaurantname:data1.restaurantname});
			
		});
      

		});		
		
		
	}
	
	
	
});

module.exports = router;
