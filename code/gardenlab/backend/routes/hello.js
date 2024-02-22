const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) { // Make sure user is authenticated
    res.render('hello', { username: req.user.username }); // Pass the username to the template
  } else {
    res.redirect('/account'); // Redirect to login page if not authenticated
  }
});

module.exports = router;
