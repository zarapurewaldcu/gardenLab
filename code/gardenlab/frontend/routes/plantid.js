var express = require('express');
var router = express.Router();

/* GET plantid page. */
router.get('/', function(req, res, next) {
  res.render('plantid', { title: 'Plant Identification page' });
});

module.exports = router;