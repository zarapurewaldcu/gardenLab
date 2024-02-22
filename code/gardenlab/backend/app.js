var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FormData = require('form-data');
const mongoose = require('mongoose');
const User = require('./models/User');
var router = express.Router();
require("dotenv").config();
const gardenModel = require('./models/gardenModel');
//const { solveMiniZincProblem } = require('./models/gardenModel');

var indexRouter = require('./routes/index');
var virtualRouter = require('./routes/virtualgarden');
var gardenplannerformRouter = require('./routes/gardenplannerform');
var usersRouter = require('./routes/users');
var plantidRouter = require('./routes/plantid');
var planthealthRouter = require('./routes/planthealth');
var helloRouter = require('./routes/hello');

var app = express();

const upload = multer({ dest: 'uploads/' }); // Temporarily save files to "uploads" directory
const accountRouter = require('./routes/account');
const createaccountRouter = require('./routes/createaccount');


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
  
app.use(session({ // session middleware
    secret: 'ANISA',
    resave: false,
    saveUninitialized: true,
  }));
  
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => done(err, user)); as Model.findById() no longer accepts a callback
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });


passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


  app.post('/planGarden', (req, res) => {
	const solve = gardenModel.solve({
	  options: {
		solver: 'gecode',
		'time-limit':  10000,
		statistics: true,
		log:true
	  }
	});

	solve.on('solution', (solution) => {
		console.log(solution.output);
		res.json({solution:solution});
	  });

	  solve.on('exit', (result) => {
		console.log(result);
		// Send the result back to the client
		res.json({
		  result: result,
		});
	  });

	//   solve.on('trace', (log) => {
	// 	console.log(log); // Log the solver's log output
	// 	res.json({log:log});
	//   });
	
	  solve.on('error', (error) => {
		console.error('An error occurred while solving the model:', error);
		// Send an error response back to the client
		res.status(500).send('An error occurred while solving the model.');
	  });
  
  });
  

  

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend/public')));


app.use('/', indexRouter);
app.use('/virtualgarden', virtualRouter);
app.use('/users', usersRouter);
app.use('/plantid', plantidRouter);
//app.use('/plantidresults', plantidRouter);
app.use('/planthealth', planthealthRouter);
app.use('/account', accountRouter);
app.use('/hello', helloRouter);
app.use('/createaccount', createaccountRouter);
app.use('/gardenplannerform', gardenplannerformRouter);



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


module.exports = app;