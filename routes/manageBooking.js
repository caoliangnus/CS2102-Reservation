var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


var reservationDetail = null;

router.get('/', function (req, res, next) {

    var user = req.app.locals.user;

    if (user.isLogIn == false) {
        res.redirect("/login");
    }

    if (user.accountType != "Customer") {
        res.redirect("/login");
    }

    var sql_query = 'select points from "ProjectSample".customer where email = ' + "'" + user.email+ "'";

    var reservation_simple_query = 'with locationReservationTable as (select * from "ProjectSample".reservation natural join "ProjectSample".branch where email ='
        + "'" + user.email + "')" + 'select * from locationReservationTable natural join "ProjectSample".address';

    console.log(user.email);
    pool.query(sql_query, (err, data) => {
        console.log(data.rows[0]);
        var point = data.rows[0].points;
        pool.query(reservation_simple_query, (err, data) => {
            reservationDetail= data.rows;            
            res.render('manageBooking', { title: 'Manage Booking', point: point, data: reservationDetail });
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
        // Construct Specific SQL Query

        var index = parseInt(req.body.index);
        var toDelete = reservationDetail[index];

        console.log(toDelete);
        console.log(toDelete.email);
        console.log(toDelete["email"]);

        var delete_query = 'DELETE FROM "ProjectSample".reservation WHERE email = ' +
            "'" + toDelete.email + "'" + "and reservationId = " + "'" + toDelete.reservationid + "'"
            + "and tableId = " + "'" + toDelete.tableid + "'" + "and branchId = " + "'" + toDelete.branchid + "'"
            + "and restaurantName = " + "'" + toDelete.restaurantname + "'";
        console.log(delete_query);


        pool.query(delete_query, (err, data) => {
            console.log(err);
            res.redirect('/manageBooking');
        });
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
});

module.exports = router;
