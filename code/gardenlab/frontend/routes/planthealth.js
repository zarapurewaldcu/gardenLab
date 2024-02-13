const express = require('express');
var router = express.Router();


/* GET planthealth page. */
router.get('/', function(req, res, next) {
  res.render('planthealth', { title: 'Plant Health Assessment page' });
});

module.exports = router;