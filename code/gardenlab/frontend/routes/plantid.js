const express = require('express');
// const multer = require('multer');
// const axios = require('axios');
// const fs = require('fs');
// const FormData = require('form-data');
var router = express.Router();


/* GET plantid page. */
router.get('/', function(req, res, next) {
  res.render('plantid', { title: 'Plant Identification page' });
});

// const app = express();
// const upload = multer({ dest: 'uploads/' }); // Temporarily save files to "uploads" directory

// app.post('/submit-plant-photo', upload.single('plant-image'), function(req, res) {
//     const file = fs.readFileSync(req.file.path);
//     const base64Image = file.toString('base64');

//     const data = {
//         api_key: "",
//         images: [base64Image],
//         modifiers: ["crops_fast", "similar_images"],
//         plant_language: "en",
//         plant_details: [
//             "common_names",
//             "url",
//             "name_authority",
//             "wiki_description",
//             "taxonomy",
//             "synonyms",
//         ],
//     };

//     axios.post('https://api.plant.id/v3/identify', data)
//         .then(response => {
//             console.log('Success:', response.data);
//             res.send(response.data); // Send API response back to client
//         })
//         .catch(error => {
//             console.error('Error: ', error);
//             res.status(500).send("Error processing your request");
//         });
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });


module.exports = router;