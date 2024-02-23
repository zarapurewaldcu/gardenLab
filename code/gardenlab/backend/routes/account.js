const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');


// Load environment variables
require('dotenv').config();




router.post('/', passport.authenticate('local', {
  successRedirect: '/hello', // Redirect to the hello page on successful login
  failureRedirect: '/account', // Redirect back to the login page on failure
  //failureFlash: true - maybe implement falsh error messages later on
}));

router.get('/', (req, res) => {
  if (req.isAuthenticated()) { // Check if user is already logged in
    res.redirect('/hello'); // Redirect to the hello page
  } else {
    res.render('account', { title: 'Login' }); // Show the login page
  }
});

module.exports = router;
