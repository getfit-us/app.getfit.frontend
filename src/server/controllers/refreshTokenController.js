const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();



const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;



    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt, req.headers);
    const refreshToken = cookies.jwt;
    
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    
    if (!foundUser) { return res.sendStatus(403); } //Unauthorized 


    // evaluate jwt 
 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) { return res.sendStatus(403); } //Unauthorized
            const accessToken = jwt.sign(
                { "email": decoded.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '60s'}
            );
            res.json({accessToken});
        }
        
        )
    }    
module.exports = { handleRefreshToken }