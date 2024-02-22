var express = require('express');
var router = express.Router();
const User = require('../models/User'); 

router.get('/', function(req, res, next) {
  res.render('gardenplanner', { title: 'Virtual Garden Planner' });
});


router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { layout, width, height } = req.body;

  try {
    // Find the user by ID and update their garden
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        'garden.layout': layout,
        'garden.width': width,
        'garden.height': height
      }
    }, { new: true }); // Return the updated user document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Garden saved successfully!', garden: updatedUser.garden });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving garden' });
  }
});

// router.post('/', (req, res) => {
//   console.log("Logged in user ID:", req.user?._id);

  // Assume `req.user` contains the authenticated user's information
  // and `req.body` contains the garden data to save
  // const { width, height, plants } = req.body;

  // // Example: Saving garden data to MongoDB
  // const garden = new gardenModel({
  //     userId: req.user._id,
  //     width,
  //     height,
  //     plants
  // });
  // user.garden = { width, height, layout };
  // user.save()
  //     .then(() => res.json({ message: 'Garden saved successfully!' }))
  //     .catch(err => {
  //         console.error(err);
  //         res.status(500).json({ message: 'Error saving garden' });
  //     });
  // garden.save()
  //     .then(() => res.json({ message: 'Garden saved successfully!' }))
  //     .catch(err => {
  //         console.error(err);
  //         res.status(500).json({ message: 'Error saving garden' });
  //     });


module.exports = router;
