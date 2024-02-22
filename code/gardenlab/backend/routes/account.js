const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
// Handle login
// router.post('/', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email address" });
//     }

//     // Check if the password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Password" });
//     }

//     // User matched, create payload for JWT
//     const payload = {
//       user: {
//         id: user.id
//       }
//     };

//     // Sign the token with user payload
//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }, // Token expiration
//       (err, token) => {
//         if (err) throw err;
//         // Send the token as a response
//        // res.json({ token });
//        res.redirect('/virtualgarden');
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

module.exports = router;
