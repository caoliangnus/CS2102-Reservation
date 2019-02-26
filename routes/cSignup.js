var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'INSERT INTO "ProjectSample".users VALUES ';
var sql_query_signup = 'SELECT * FROM "ProjectSample".users';

// GET
router.get('/', function (req, res, next) {
    res.render('cSignup', { title: 'SIGNUP Database', error: false });
});

// POST
router.post('/', function (req, res, next) {

    // Retrieve Information
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var accType = "Customer";

    var retrieve_query = sql_query_signup + " where email = '" + email + "'";
    var insert_query = sql_query + "('" + email + "','" + password + "','" + name + "','" + accType + "')";

    // Retrieve from database to check if email in use
    pool.query(retrieve_query, (err, data) => {

        // If no data, email is not in use
        if (data.rows.length == 0) {
            // Insert new user/customer into database, login and redirect to home page
            pool.query(insert_query, (err, data) => {

                var user = {
                    name: name,
                    email: email,
                    accountType: accType,
                    isLogIn: true
                }

                req.app.locals.user = user;

                res.redirect("/");
            });
        }
        // Else, email is in use, return error to cSignup page
        else {
            res.render('cSignup', { title: 'SIGNUP Database', error: true });
        }
    });
});

module.exports = router;
