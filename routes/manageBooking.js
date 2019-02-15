var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'SELECT * FROM student_info';
var update_query = 'UPDATE student_info SET';


router.get('/', function (req, res, next) {
    pool.query(sql_query, (err, data) => {
        res.render('manageBooking', { title: 'Manage Booking', data: data.rows });
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
