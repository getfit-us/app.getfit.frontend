require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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


app.options('*', function (req, res) { res.sendStatus(200); });



function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}







//routes 
app.use('/register', require('./routes/register'));

app.use('/login', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/clients', require('./routes/clients'));

//everything below requires authorization req headers not being sent by client... need to debug
app.use(verifyJWT);
// app.use('/clients', require('./routes/clients'));
app.use('/users', require('./routes/users'));
app.use('/exercises', require('./routes/exercises'));










mongoose.connection.once('open', () => {
  console.log('Connected to mongo');
  app.listen(8000, () => console.log('API is running on http://localhost:8000/'));

})
