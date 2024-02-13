var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
var router = express.Router();
require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var plantidRouter = require('./routes/plantid');

var app = express();
const upload = multer({ dest: 'uploads/' }); // Temporarily save files to "uploads" directory


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/plantid', plantidRouter);
app.use('/plantidresults', plantidRouter);


app.post('/submit-plant-photo-for-id', upload.single('plant-image'), async (req, res) => {
    // Create a new instance of FormData
    var data = new FormData();
    // Append the file using the path from the uploaded file and additional fields
    data.append('image1', fs.createReadStream(req.file.path));
    //data.append('latitude', '49.207'); // Static value for demonstration, can be dynamic OPTIONAL
    //data.append('longitude', '16.608'); // Static value for demonstration, can be dynamic OPTIONAL
    data.append('similar_images', 'true');

    var config = {
        method: 'post',
        url: 'https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods&language=en',
        headers: { 
            'Api-Key': process.env.PLANTID_API_KEY, // Using dotenv to hide api key
            ...data.getHeaders() // Spread operator to append FormData headers
        },
        data: data,
        maxBodyLength: Infinity,
    };

    // Use axios to send the POST request
    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            // Send response back to client
            //res.json(response.data);
			//displayImages(response.data);
			res.render('plantidresults', { data: response.data });
			fs.unlink(req.file.path, (err) => { // delete the image file after it is posted and the new page is rendered.
                if (err) {
                    console.error("Error deleting the file:", err);
                    return;
                }
                console.log("File deleted successfully:", req.file.path);
            });
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send("Error processing your request");
        });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });


module.exports = app;