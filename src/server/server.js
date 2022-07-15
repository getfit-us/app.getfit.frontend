const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');






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


//everything below requires authorization
app.use(verifyJWT);
app.use('/clients', (req, res) => {

  const clients = [
    {
      "id": "0",
      "firstName": "chris",
      "lastName": "scott",
      "email": "chrisscott@gmail.com",
      "password": "password",
      "phone": "555-1234"
    },
    {
      "id": "1",
      "firstName": "bill",
      "lastName": "scott",
      "email": "chrisscott@gmail.com",
      "password": "password",
      "phone": "555-1234"
    }]

  res.send(clients);



})










app.listen(8000, () => console.log('API is running on http://localhost:8000/'));
