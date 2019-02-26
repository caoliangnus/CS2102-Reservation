var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

var capacity;
var restaurant;
var time;
var date;
var location;
var cuisine;

/* SQL Query */
var query = "with mealprice as (" +
	"select restaurantname, concat(mealname, '(' ,price,')') as menu "+
	'from "ProjectSample".meals '+
"), fullmenu as("+
"SELECT restaurantname, array_to_string(array_agg(menu), ',') AS allmenu FROM mealprice GROUP BY restaurantname), "+
"slots as( "+
	'select branchid, restaurantName, sum(capacity) as capacity 	from "ProjectSample".tables group by branchid,restaurantName)' +
"select R.restaurantname, R.restauranttype, B.branchid, A.fulladdress, S.capacity, F.allmenu "+
'from "ProjectSample".restaurant as R, "ProjectSample".branch as B, "ProjectSample".address as A,slots as S, fullmenu as F '+
'where R.restaurantname = B.restaurantname and B.postalcode = A.postalcode and S.branchid=B.branchid and S.restaurantname = B.restaurantname and F.restaurantname = B.restaurantname;'

var sql_query = 'SELECT * FROM "ProjectSample".users';
router.get('/', function (req, res, next) {

    var searchInfo = req.query;
    if (searchInfo.type == 0) {
        searchInfo.type = "Any Type"
    }

    pool.query(query, (err, data) => {
        res.render('searchResult', { title: 'Search Result', data: data.rows, searchInfo: searchInfo });
    });
});

module.exports = router;
