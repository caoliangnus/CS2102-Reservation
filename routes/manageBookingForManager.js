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

    if (user.accountType != "Manager") {
        res.redirect("/login");
    }

    var restaurant_query = 'select * from "ProjectSample".manages where email = ' + "'" + user.email + "'";

    pool.query(restaurant_query, (err, data) => {
        var rName = data.rows[0].restaurantname;
        var reservation_simple_query = 'with locationReservationTable as (select * from "ProjectSample".reservation natural join "ProjectSample".branch where restaurantName ='
            + "'" + rName + "')" + 'select * from locationReservationTable natural join "ProjectSample".address' + 
            " where status=1";

        pool.query(reservation_simple_query, (err, data) => {
            reservationDetail = data.rows;
            console.log(reservationDetail)
            res.render('manageBookingForManager', { title: 'Manage Booking', data: reservationDetail });
        });
    
    })

     
});


// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    console.log(req.body);
    var button = req.body.submit;
    console.log(button);
    if (button == "Finished") {
        // Construct Specific SQL Query

        var index = parseInt(req.body.index);
        var toUpdate = reservationDetail[index];
  
        console.log(toUpdate);
       //Update status
        var update_Query = 'UPDATE "ProjectSample".reservation SET status = 0 WHERE reservationid = ' + toUpdate.reservationid + 
        " and email = " + "'" + toUpdate.email + "'" +
            " and tableid =" + toUpdate.tableid +
            " and branchid = " + toUpdate.branchid +
            " and restaurantname = '" + toUpdate.restaurantname + "';";

        pool.query(update_Query, (err, data) => {
            console.log(err);
            res.redirect('/manageBookingForManager');
        });
    } 
});

module.exports = router;
