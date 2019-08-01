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

	res.json({
        status : "ok",
        message : "Twin successfully updated."
    });
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
