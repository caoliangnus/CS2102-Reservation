var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var user = req.app.locals.user;
  res.render('index', { title: 'Home Page', user: user});
});


// POST
router.post('/logOut', function (req, res, next) {
  var user = req.app.locals.user;
  user.isLogIn = false;
  req.app.locals.user = user;
  res.render('index', { title: 'Home Page', user: user });
});


module.exports = router;
