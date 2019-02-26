var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
var q1 ="with slots as( "+  "select T.restaurantname, T.branchid,T.tableid from "+
  '"ProjectSample".tables T where T.capacity >='
var q2 = " except select R.restaurantname, R.branchid,R.tableid from "+
'"ProjectSample".reservation R where R.reserveddate= '
var q3=" and R.starttime = "
var q4=' ), mealprice as '+
"(select restaurantname, concat(mealname, '(' ,price,')') as menu from "+
 ' "ProjectSample".meals), fullmenu as '+
" (SELECT restaurantname, array_to_string(array_agg(menu), ', ') AS allmenu FROM mealprice GROUP BY restaurantname) "+
' select distinct R.restaurantname, R.restauranttype, B.branchid, A.fulladdress, F.allmenu '+
' from "ProjectSample".restaurant as R, "ProjectSample".branch as B, "ProjectSample".address as A,slots as S, fullmenu as F '+
" where R.restaurantname = B.restaurantname and B.postalcode = A.postalcode and S.branchid=B.branchid "+
" and S.restaurantname = B.restaurantname and F.restaurantname = B.restaurantname"

var extra_condition_restaurant = '';
var extra_condition_cuisine = '';
var extra_condition_location = ' and (';
var end_query = ');'
var sql = 'select * from "ProjectSample".user;'

router.get('/', function (req, res, next) {

    var searchInfo = req.query;

    if (searchInfo.type == 0) {
        searchInfo.type = "Any Cuisine"
        extra_condition_cuisine = " and 1=1"
    }else {
      extra_condition_cuisine = " and R.restauranttype="+"'"+searchInfo.type+"'"
    }
    if (searchInfo.restaurant == 0){
      searchInfo.restaurant = "Any Restaurant"
      extra_condition_restaurant=' and 1=1'
    }else{
      extra_condition_restaurant = " and R.restaurantname="+"'"+searchInfo.restaurant+"'"
    }

    var locations = searchInfo.locations.split(',');
    for(var i=0;i<locations.length;i++){
      if(i == 0){
        var extra_condition_location = ' and (';
      }
      if(i!=0) {
        extra_condition_location += " or "
      }
      extra_condition_location += " A.area="+"'"+locations[i]+"'"
    }
    //console.log(extra_condition_location);

    var dates = searchInfo.date.split('/');
    var date = dates[2]+'-'+dates[0]+'-'+dates[1];

    var final_query = q1 +' '+"'"+searchInfo.people+"'"+' '+q2+' '+"'"+date+"'"+' '+q3+' '+"'"+searchInfo.time+"'"+' '+q4
    +' '+extra_condition_restaurant+' '+extra_condition_cuisine+' '+extra_condition_location+' '+end_query

    console.log(final_query);

    pool.query(final_query, (err, data) => {
        res.render('searchResult', { title: 'Search Result', data: data.rows, searchInfo: searchInfo });
    });
});

module.exports = router;
