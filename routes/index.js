const debug = require('debug')('routes:index');
const express = require('express');
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

/* GET home page. */
router.get('/', function(req, res, next) {

	twins.listByUser(res.locals.w3id_userid)
		.then(twins => {

			debug("Stored Twins", JSON.stringify(twins));

			twins = twins.sort( (a, b) => {

				if(a.name > b.name){
					return 1
				} else {
					return -1;
				}

			});

			res.render('index', { 
				title: 'Twin Selector',
				stylesheet : "selection.css",
				twins : twins
			});

		})
		.catch(err => {
			debug("List Twins err:", err);
			res.status(500);
			res.error = err;
			next(res);
		})
	;

});

module.exports = router;
