const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    console.log(`req headers: ${authHeader, req.headers.authorization}`);
    if (!authHeader) { 
        return res.sendStatus(401);
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err) { return res.sendStatus(403); }
            req.email = decoded.email;
            next();

        }
        
        )

}

module.exports = verifyJWT
