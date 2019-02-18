var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('dotenv').load();

var indexRouter = require('./routes/index');        //Home Page
var cSignupRouter = require('./routes/cSignup');    //Customer Signup page
var rSignupRouter = require('./routes/rSignup');    //Restaurant Signup page
var logInRouter = require('./routes/login');        //Login Page
var mRestaurantRouter = require('./routes/mRestaurant'); // Manage restaurant page
var tableRouter = require('./routes/table');
var loopsRouter = require('./routes/loops');
var selectRouter = require('./routes/select');
var formsRouter = require('./routes/forms');
var insertRouter = require('./routes/insert');

var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cSignup', cSignupRouter);     //url: customer signup
app.use('/rSignup', rSignupRouter);     //url: restaurant signup
app.use('/login', logInRouter);         //url: login
app.use('/mRestaurant', mRestaurantRouter); // url: mRestaurant

app.use('/table', tableRouter);
app.use('/loops', loopsRouter);
app.use('/select', selectRouter);
app.use('/forms', formsRouter);
app.use('/insert', insertRouter);

app.use('/users', usersRouter);
app.use('/about', aboutRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//Global varaible
app.locals.user = {
  name: null,
  email: null,
  isLogIn: false
}

module.exports = app;
