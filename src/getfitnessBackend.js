const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')

const cookiesMiddleware = require('universal-cookie-express');

const app = express();

//cors needs origin set in headers 

app
.use(cors({credentials: true, origin: 'http://localhost:3000'}))
.use(express.json())
.use(cookiesMiddleware())
.use(cookieParser())

const dbAddress = "http://localhost:8001/"



function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


class Session {
    constructor(email, expiresAt) {
        this.email = email
        this.expiresAt = expiresAt
    }

		// we'll use this method later to determine if the session has expired
    isExpired() {
        this.expiresAt < (new Date())
    }
}

// this object stores the users sessions. For larger scale applications, you can use a database or cache for this purpose
const sessions = {}






app.post('/logins', (req, res) => {
   
    const {email, password} = req.body
    const sessionToken = makeId(50);
    const now = new Date()
    const expiresAt = new Date(+now + 240 * 10000 )
    console.log(expiresAt)
    const session = new Session(email, expiresAt)
    sessions[sessionToken] = session

        const message = 'SuccessFul Login'
        
        console.log(`Request: ${email } ${password}`);
        console.log(`Token: ${sessionToken}`);

        if (!email || !password) {
            res.status(403).send('Invalid credentials');
        }



        res.status(200)
        res.cookie("session_token", sessionToken, { expires: expiresAt })
        res.send(message)
        
        
  


});

app.get('/clients' , (req, res) => {

   const clients =  [
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










app.listen(8000, () => console.log('API is running on http://localhost:8000/logins'));
