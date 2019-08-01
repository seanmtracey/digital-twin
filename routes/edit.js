const debug = require('debug')('routes:edit');
const express = require('express');
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;
	
router.get(`/:UUID(${UUIDRegex})`, function(req, res, next) {

	twins.get(req.params.UUID)
		.then(twin => {
			
			debug("gettwin:", twin[0]);
			
			twin[0].nodes = JSON.stringify(twin[0].nodes);

			res.render('edit', { 
				title: 'Digital Twin Editor',
				stylesheet : "edit.css",
				twinData : twin[0]
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
