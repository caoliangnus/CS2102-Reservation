var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('restaurantSignup', { title: 'Sign up' });
});

module.exports = router;
