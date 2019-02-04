var express = require('express');
var router = express.Router();

router.get('/forms', function(req, res, next) {
	res.render('forms', { title: 'Forms and Interaction' });
});

module.exports = router;
