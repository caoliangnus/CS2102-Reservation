var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'INSERT INTO "ProjectSample".Users (username, email, password, accounttype) VALUES';

// GET
router.get('/', function (req, res, next) {
    res.render('cSignup', { title: 'SIGNUP Database' });
});

// POST
router.post('/', function (req, res, next) {

    // Retrieve Information
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    // Construct Specific SQL Query
    var insert_query = sql_query + "('" + name + "','" + email + "','" + password + "', " + "'" + 'Customer' + "'" + ")";
    console.log(insert_query);
    pool.query(insert_query, (err, data) => {
		console.log(err);
        res.redirect('/')
    });
});

module.exports = router;
