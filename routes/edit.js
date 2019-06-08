const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('edit', { title: 'Teemill Visualisation' });
});

module.exports = router;
