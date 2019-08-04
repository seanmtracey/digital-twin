const debug = require('debug')('routes:twins');
const express = require(`express`);
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

/* GET home page. */

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;

router.post(`/create`, function(req, res, next) {

    debug(req.body);
    debug(res.locals);

    if(req.body.name){

        twins.create({ name : req.body.name, owner: res.locals.w3id_userid })
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

router.post(`/update/:UUID(${UUIDRegex})`, function(req, res, next) {

    debug(req.body);

    console.log(`Updating twin ${req.params.UUID}`);

    twins.update(req.params.UUID, req.body.data, res.locals.w3id_userid)
        .then(result => {
            debug(result);
            
            res.json({
                status : "ok",
                message : "Twin successfully updated."
            });

        })
        .catch(err => {

            debug(`Error updating twin ${req.params.UUID}`. err);
            
            res.status(500);
            res.json({
                status : 'err',
                message : 'An internal error occured preventing your twins configuration from being saved'
            });
        
        })
    ;

});

router.post(`/duplicate/:UUID(${UUIDRegex})`, function(req, res, next) {
	res.json({
        status : "ok",
        message : "Twin successfully duplicated."
    });
});

router.post(`/delete/:UUID(${UUIDRegex})`, function(req, res, next) {
	res.json({
        status : "ok",
        message : "Twin successfully deleted."
    });
});

module.exports = router;
