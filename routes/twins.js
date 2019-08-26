const debug = require('debug')('routes:twins');
const express = require(`express`);
const router = express.Router();

const storage = require(`${__dirname}/../bin/lib/storage`);
const twins = require(`${__dirname}/../bin/lib/twins`);

/* GET home page. */

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;

router.post(`/create`, function(req, res) {

    debug(req.body);
    debug(res.locals);

    if(req.body.name){

        twins.create({ name : req.body.name, owner: res.locals.w3id_userid, broker : req.body.broker })
            .then(data => {
                
                res.json({
                    status : "ok",
                    message : "Twin successfully created.",
                    data : data
                });

            })
            .catch(err => {
                debug('/create err:', err);
                res.status(500);
                res.json({
                    status : "err",
                    message : "Cannot create Twin without name"
                });
            })
        ;

    } else {
        res.status(401);
        res.json({
            status : "err",
            message : "Cannot create Twin without name"
        });
    }

});

router.post(`/update/:UUID(${UUIDRegex})`, function(req, res) {

    debug(req.body);

    console.log(`Updating twin ${req.params.UUID}`);

    req.body.data.modified = Date.now() / 1000 | 0;

    twins.update(req.params.UUID, req.body.data, res.locals.w3id_userid)
        .then(result => {
            debug(result);
            
            res.json({
                status : "ok",
                message : "Twin successfully updated."
            });

        })
        .catch(err => {

            debug(`Error updating twin ${req.params.UUID}`, err);
            
            res.status(500);
            res.json({
                status : 'err',
                message : 'An internal error occured preventing your twins configuration from being saved'
            });
        
        })
    ;

});

router.post(`/duplicate/:UUID(${UUIDRegex})`, function(req, res) {

    twins.duplicate(req.params.UUID, req.body.data, res.locals.w3id_userid)
        .then(result => {
            
            debug(result);
            
            res.json({
                status : "ok",
                message : "Twin successfully duplicated.",
                data : result
            });

        })
        .catch(err => {
            
            debug(`Error duplicating twin ${req.params.UUID}`, err);

            res.status(500);
            res.json({
                status : 'err',
                message : 'An internal error occured preventing the duplication of the twin from being saved'
            });

        })
    ;
    
});

router.post(`/delete/:UUID(${UUIDRegex})`, function(req, res) {

    twins.delete(req.params.UUID, res.locals.w3id_userid)
        .then(result => {
            debug(result);

            res.json({
                status : "ok",
                message : `Twin ${req.params.UUID} successfully deleted.`,
            });

        })
        .catch(err => {
            debug('Deleting twin error:', err);
            res.status(500);
            res.json({
                status : 'err',
                message : `An internal error occured preventing the deletion of the twin ${req.params.UUID}`
            });
        })
    ;

});

router.get(`/check-for-latest/:UUID(${UUIDRegex})`, (req, res, ) => {
    
    twins.get(req.params.UUID)
		.then(twin => {
			
			debug("gettwin:", twin);
			
			twin.nodes = JSON.stringify(twin.nodes);

            res.json({
                status : 'ok',
                data : {
                    modified : twin.modified || twin.created
                }
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
