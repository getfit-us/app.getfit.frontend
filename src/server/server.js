require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');

const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./config/dbConn');



// connect to mongo

connectDB();




//cors needs origin set in headers 

app
  .use(credentials)
  .use(cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())

  // const options = {
  //   key: fs.readFileSync('app.getfit.us.key'),
  //   cert: fs.readFileSync('app.getfit.crt')
  // };
app.options('*', function (req, res) { res.sendStatus(200); });









//routes 
app.use('/avatar',express.static('public/avatar_images')); //public route for storing profile images 
app.use('/progress',express.static('public/measurement_images')); //public route for storing progress images
//to signup or register
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/auth'));
//refresh jwt token after accessToken expires
app.use('/refresh', require('./routes/refresh'));
//logout user and clear tokens and state. 
app.use('/logout', require('./routes/logout'));
// verify email address
app.use('/verify', require('./routes/verify'));

//everything below requires authorization jwt -- Must be logged in
app.use(verifyJWT);
//updating password route
app.use('/updatepassword', require('./routes/password'));
//for clients to log workouts
app.use('/completed-workouts', require('./routes/workouts'));
//for trainers to create custom workout routines for clients to complete
app.use('/custom-workout', require('./routes/customWorkouts'));

app.use('/users', require('./routes/users'));
//route for exercise choice
app.use('/exercises', require('./routes/exercises'));

app.use('/trainers', require('./routes/trainers'));
//route for recording client measurements
app.use('/measurements', require('./routes/measurements'));

//route for uploading profile image
app.use('/upload', require('./routes/uploadimg'));










mongoose.connection.once('open', () => {
  console.log('Connected to mongo');
  //https.createServer(options,app).listen(8000, () => console.log('API is running on http://localhost:8000/'));
  app.listen(8000, () => console.log('http running 8000'));
})
