var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const mongoose = require('mongoose');
const MiniZinc = require('minizinc');
var router = express.Router();
require("dotenv").config();

var indexRouter = require('./routes/index');
var virtualRouter = require('./routes/virtualgarden');
var gardenplannerformRouter = require('./routes/gardenplannerform');
var usersRouter = require('./routes/users');
var plantidRouter = require('./routes/plantid');
var planthealthRouter = require('./routes/planthealth');
var userRouter = require('./routes/user');

var app = express();

const upload = multer({ dest: 'uploads/' }); // Temporarily save files to "uploads" directory

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
  

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend/public')));



app.use('/index', indexRouter);
app.use('/virtualgarden', virtualRouter);
app.use('/gardenplannerform', gardenplannerformRouter);
app.use('/users', usersRouter);
app.use('/plantid', plantidRouter);
//app.use('/plantidresults', plantidRouter);
app.use('/planthealth', planthealthRouter);
app.use('/api/user', userRouter);



app.post('/submit-plant-photo-for-id', upload.single('plant-image'), async (req, res) => {
    // Create a new instance of FormData
    var data = new FormData();
    // Append the file using the path from the uploaded file and additional fields
    data.append('image1', fs.createReadStream(req.file.path));
    //data.append('latitude', '49.207'); // Static value for demonstration, can be dynamic OPTIONAL
    //data.append('longitude', '16.608'); // Static value for demonstration, can be dynamic OPTIONAL
    data.append('similar_images', 'true');

    var configplantid = {
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
    axios(configplantid)
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

app.post('/submit-plant-photo-for-assessment', upload.single('plant-image'), async (req, res) => {
    // Create a new instance of FormData
    var data = new FormData();
    // Append the file using the path from the uploaded file and additional fields
    data.append('image1', fs.createReadStream(req.file.path));
    //data.append('latitude', '49.207'); // Static value for demonstration, can be dynamic OPTIONAL
    //data.append('longitude', '16.608'); // Static value for demonstration, can be dynamic OPTIONAL
    data.append('similar_images', 'true');
	//data.append('health', 'only');

    var configplanthealth = {
        method: 'post',
        url: 'https://plant.id/api/v3/health_assessment?language=en&details=local_name,description,url,treatment,classification,common_names,cause',
        headers: { 
            'Api-Key': process.env.PLANTID_API_KEY, // Using dotenv to hide api key
            ...data.getHeaders(), // Spread operator to append FormData headers
        },
        data: data,
		// "health":"only",
        maxBodyLength: Infinity,
    };

    // Use axios to send the POST request
    axios(configplanthealth)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            // Send response back to client
            //res.json(response.data);
			//displayImages(response.data);
			res.render('planthealthresults', { data: response.data });
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

// Minizinc related code in this file from https://www.npmjs.com/package/minizinc 
//WIP
// MiniZinc.init({
// 	// Executable name
// 	minizinc: 'minizinc',
// 	// Search paths (can omit to use PATH)
// 	minizincPaths: ['minizinc/']
//   });

// const model = new MiniZinc.Model();
// // Add a file with a given name and string contents
// model.addFile('test.mzn', 'var 1..3: x; int: y;');
// // Add model code from a string
// model.addString('int: z;');
// // Add data in DZN format
// model.addDznString('y = 1;');
// // Add data from a JSON object
// model.addJSON({z: 2});

// const solve = model.solve({
//   options: {
//     solver: 'gecode',
//     'time-limit': 10000,
//     statistics: true
//   }
// });

// // You can listen for events
// solve.on('solution', solution => console.log(solution));
// solve.on('statistics', stats => console.log(stats.statistics));

// // And/or wait until complete
// solve.then(result => {
//   console.log(result.solution);
//   console.log(result.statistics);
// });
  

  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });

  // catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
  });

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	next(createError(404));
//   });
  
//   // error handler
//   app.use(function(err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
// 	// render the error page
// 	res.status(err.status || 500);
// 	res.render('error');
//   });

module.exports = app;