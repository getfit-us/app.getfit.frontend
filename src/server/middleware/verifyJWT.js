const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log(`req headers: ${authHeader}`);
    if (!authHeader?.startsWith('Bearer ')) { 
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err) { return res.sendStatus(403); }
            req.email = decodedToken.UserInfo.email;
            req.roles = decodedToken.UserInfo.roles;

            next();

        }
        
        )

}

module.exports = verifyJWT
