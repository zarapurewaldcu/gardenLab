var express = require('express');
var router = express.Router();

/* GET plant id results page page. */
router.get('/', function(req, res, next) {
  res.render('plantidresults', { title: 'Plant results page' });
});

module.exports = router;