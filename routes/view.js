const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('view', { 
		title: 'Digital Twin Viewer',
		stylesheet : "view.css"
	});
});

module.exports = router;
