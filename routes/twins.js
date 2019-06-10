const debug = require('debug')('routes:twins');
const express = require(`express`);
const router = express.Router();

const twins = require(`${__dirname}/../bin/lib/twins`);

/* GET home page. */

const UUIDRegex = `[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}`;

router.post(`/create/:UUID(${UUIDRegex})`, function(req, res, next) {
	res.json({
        status : "ok",
        message : "Twin successfully created."
    });
});

router.post(`/update/:UUID(${UUIDRegex})`, function(req, res, next) {
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
