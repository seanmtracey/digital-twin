const debug = require('debug')('routes:view');
const express = require('express');
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;

router.get(`/:UUID(${UUIDRegex})`, function(req, res, next) {
	twins.get(req.params.UUID)
		.then(twin => {
			
			debug("gettwin:", twin);
			
			twin.nodes = JSON.stringify(twin.nodes);

			res.render('view', { 
				title: 'Digital Twin Editor',
				stylesheet : "view.css",
				twinData : twin
			});

		})
		.catch(err => {
			debug('Getting twin error:', err);
			res.error = 500;
			next();
		})
	;
});

module.exports = router;
