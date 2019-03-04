var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

router.get('/', function (req, res, next) {

    var extra_condition_restaurant = '';
    var extra_condition_cuisine = '';
    var extra_condition_location = ' and (';
    var end_query = ');'
    var sql = 'select * from "ProjectSample".tables;'

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

    if(!searchInfo.locations){
      searchInfo.locations = "Any Location"
      extra_condition_location = ' and (1=1'
    }else{
      var locations = searchInfo.locations.split(',');
      var extra_condition_location = '';

        for(var i=0;i<locations.length;i++){
          if(i == 0){
            var extra_condition_location = ' and (';
          }
          if(i!=0) {
            extra_condition_location += " or "
          }
          extra_condition_location += " A.area="+"'"+locations[i]+"'"
        }
      }
    //console.log(extra_condition_location);

    var dates = searchInfo.date.split('/');
    var date = dates[2]+'-'+dates[0]+'-'+dates[1];

    var base_getSearchResult =" with slots as( "+  "select T.restaurantname, T.branchid,T.tableid from "+
      ' "ProjectSample".tables T where T.capacity >= ' +"'"+searchInfo.people+"'"+
      " except select R.restaurantname, R.branchid,R.tableid from "+
      ' "ProjectSample".reservation R where R.reserveddate= '+"'"+date+"'"+
      " and R.starttime = "+"'"+searchInfo.time+"'"+
      ' ), mealprice as '+
      " (select restaurantname, concat(mealname, '(' ,price,')') as menu from "+
      ' "ProjectSample".meals), fullmenu as '+
      " (SELECT restaurantname, array_to_string(array_agg(menu), ', ') AS allmenu FROM mealprice GROUP BY restaurantname) "+
      ' select distinct R.restaurantname, R.restauranttype, B.branchid, A.fulladdress, F.allmenu '+
      ' from "ProjectSample".restaurant as R, "ProjectSample".branch as B, "ProjectSample".address as A,slots as S, fullmenu as F '+
      " where R.restaurantname = B.restaurantname and B.postalcode = A.postalcode and S.branchid=B.branchid "+
      " and S.restaurantname = B.restaurantname and F.restaurantname = B.restaurantname"

    var final_getSearchResult = base_getSearchResult
    +' '+extra_condition_restaurant+' '+extra_condition_cuisine+' '+extra_condition_location+' '+end_query

    console.log(final_getSearchResult)
    pool.query(final_getSearchResult, (err, data) => {
        res.render('searchResult', { title: 'Search Result', data: data.rows, searchInfo: searchInfo });
    });

});

router.post('/', function (req, res, next) {

    // Only logged in customer can make reservation
    if (user.isLogIn == false || user.accountType !="Customer") {
        res.redirect("/login");
    }
    //get data
    var index = parseInt(req.body.index);
    var email = req.app.locals.user.email;
    var branchid = data[index].branchid;
    var rname = data[index].restaurantname;
    var starttime = searchInfo.time;
    var pax = searchInfo.people;
    var endtime = 1 + starttime; //assuming customer only eat for an hour
    var rdate = date;

    //get a table and make reservation
    var insert_resevation = " with slots as(select T.restaurantname, T.branchid,T.tableid "+
    ' from "ProjectSample".tables T '+
    " where T.capacity >= "+"'"+pax+"'"+' except '+
    " select R.restaurantname, R.branchid,R.tableid "+
    ' from "ProjectSample".reservation R '+
    " where R.reserveddate = "+"'"+rdate+"'"+ " and R.starttime = " +"'"+starttime+"'"+ " ), "+
    " soleId as ( select S.tableid "+
    ' from slots as S natural join "ProjectSample".tables as T '+
    " where S.restaurantname = " +"'"+rname+"'"+ " and S.branchid= "+"'"+branchid+"'"+
    " order by T.capacity asc limit 1) "+
    ' insert into "ProjectSample".reservation (email,tableid,branchid,restaurantname,starttime,endtime,reserveddate,status,people) '+
    ' select '+"'"+email+"'"+','+' tableid, '+"'"+branchid+"'"+' , '+"'"+rname+"'"+','+"'"+starttime+"'"+','+"'"+endtime+"'"+','+"'"+rdate+"'"+
    ' , 1 , '+','+"'"+pax+"'"+ " from soleId;"

    pool.query(insert_resevation, (err, data) => {
        console.log(err);
        res.redirect('/manageBooking');
    });

});

module.exports = router;
