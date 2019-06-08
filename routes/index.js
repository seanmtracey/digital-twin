const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Digital Twin Selector',
		stylesheet : "selection.css"
	});
});

module.exports = router;
