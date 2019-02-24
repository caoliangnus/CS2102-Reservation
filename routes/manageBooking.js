var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query2 = 'select * from student_info'
var update_query = 'UPDATE student_info SET';


router.get('/', function (req, res, next) {

    var user = req.app.locals.user;

    if (user.isLogIn == false) {
        res.redirect("/login");
    }

    sql_query = 'select points from "ProjectSample".customer where email = ' + "'" + user.email+ "'";
    var reservation_query = 'with BranchLocation as (select * from "ProjectSample".reservation ' +
        'natural join "ProjectSample".branch where email = ' + "'" + user.email + "') " +
        'select restaurantname, starttime, BranchLocation.reservedDate::timestamp, people, fulladdress, ' +
        '"ProjectSample".area.area from BranchLocation, "ProjectSample".address natural join "ProjectSample".area ' +
        'where "ProjectSample".address.postalcode = BranchLocation.postalcode';
    console.log(user.email);
    pool.query(sql_query, (err, data) => {
        console.log(data.rows[0]);
        var point = data.rows[0].points;
        pool.query(reservation_query, (err, data) => {
            var datas = data.rows
            res.render('manageBooking', { title: 'Manage Booking', point: point, data: datas });
        });
        
    });    
});


// POST
router.post('/', function (req, res, next) {
    // Retrieve Information

    console.log(req.body);
    var button = req.body.submit;
    console.log(button);
    if (button == "delete") {
      
    } else {

        var matric = req.body.matric;
        var name = req.body.name;
        var faculty = req.body.faculty;
        // Construct Specific SQL Query

        var update_query = "UPDATE student_info set name = '"+ name + "', faculty = '"+ faculty 
            + "' where matric = '" + matric + "'";

        pool.query(update_query, (err, data) => {
            console.log(data);
            res.redirect('/manageBooking')
        });
        
    }


    // Retrieve Information
    // var name = req.body.name;
    // var email = req.body.email;
    // var password = req.body.password;

   
});

module.exports = router;
