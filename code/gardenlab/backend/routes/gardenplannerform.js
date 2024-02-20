var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('gardenplannerform', { title: 'Virtual Garden Planner' });
});

module.exports = router;
