const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config();

// Serve the login page
router.get('/', (req, res) => {
  res.render('account', { title: 'Login' });
});


router.post('/', passport.authenticate('local', {
  successRedirect: '/virtualgarden', // Redirect to the virtual garden page on successful login
  failureRedirect: '/account', // Redirect back to the login page on failure
  //failureFlash: true - maybe implement falsh error messages later on
}));
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
