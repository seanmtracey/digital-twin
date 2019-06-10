const debug = require('debug')('routes:index');
const express = require('express');
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

/* GET home page. */
router.get('/', function(req, res, next) {

	twins.list()
		.then(twins => {

			res.render('index', { 
				title: 'Digital Twin Selector',
				stylesheet : "selection.css",
				twins : twins
			});

		})
		.catch(err => {
			debug("List Twins err:", err);
			res.status = 500;
			res.error = err;
			next(res);
		})
	;

});

module.exports = router;
