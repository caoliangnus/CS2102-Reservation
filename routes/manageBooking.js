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
            reservationDetail.name = user.email;       
            console.log(reservationDetail)     
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
    if (button == "Cancel") {
        // Construct Specific SQL Query

        var index = parseInt(req.body.index);
        var toDelete = reservationDetail[index];

        var delete_query = 'DELETE FROM "ProjectSample".reservation WHERE email = ' +
            "'" + toDelete.email + "'" + "and reservationId = " + "'" + toDelete.reservationid + "'"
            + "and tableId = " + "'" + toDelete.tableid + "'" + "and branchId = " + "'" + toDelete.branchid + "'"
            + "and restaurantName = " + "'" + toDelete.restaurantname + "'";
        console.log(delete_query);

        pool.query(delete_query, (err, data) => {
            console.log(err);
            res.redirect('/manageBooking');
        });
    } else if (button == "Rating") {
        var rating = req.body.rating;
        var index = req.body.indexModal;
        var toUpdate = reservationDetail[index];
        var rName = toUpdate.restaurantname;

        var updateRatingQuery = 'insert into "ProjectSample".Ratings(rating, restaurantName) values (' + rating + ", '" + rName + "');" ;

        pool.query(updateRatingQuery, (err, data) => {

            console.log(err);
            //Update status
            var update_Query = 'UPDATE "ProjectSample".reservation SET status = 2 WHERE reservationid = ' + toUpdate.reservationid +
                " and email = " + "'" + toUpdate.email + "'" +
                " and tableid =" + toUpdate.tableid +
                " and branchid = " + toUpdate.branchid +
                " and restaurantname = '" + toUpdate.restaurantname + "';";
            
            pool.query(update_Query, (err, data) => {
                res.redirect('/manageBooking')

            })
        });

    } else if (button == "Redeem") {
		var redeemPoints = req.body.redeemPoints - 10;
		var user = req.app.locals.user;
		var description = '10% discount at participating restaurants';
		
		//Update points & create redeem entry
		var select_query_redeemID = 'SELECT redeemid from "ProjectSample".redeem ORDER BY redeemid DESC LIMIT 1;';
		var update_query_points = 'UPDATE "ProjectSample".customer SET points = ' + redeemPoints + " where email='" + user.email + "';";
		var insert_query = 'INSERT into "ProjectSample".redeem (redeemId, description, email) values (';
		
		pool.query(select_query_redeemID, (err, data) => {
			
			var latestID = 1;
			
			if (data.length != 0) {
				latestID = data.rows[0].redeemid + 1;
			}
			
			pool.query(update_query_points, (err, data) => {
				
				var insert_query_redeem = insert_query + latestID + ", '" + description + "', '" + user.email + "');";
				
				pool.query(insert_query_redeem, (err, data) => {
					res.redirect('/manageBooking')
				})
			})
        })
	}
});

module.exports = router;
