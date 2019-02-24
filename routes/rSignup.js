var express = require('express');
var router = express.Router();

const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select * from "ProjectSample".foodType;';


router.get('/', function (req, res, next) {
    var foodType;
    pool.query(sql_query, (err, data) => {
        foodType = data.rows
        console.log(foodType);
        res.render('rSignup', { title: 'Sign up', foodType: foodType });
    });

});

module.exports = router;
