const User = require('../model/User');

const jwt = require('jsonwebtoken');



const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies;
    console.log(`refresh route hit: ${req.url}`);


    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt, req.headers);
    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({refreshToken}).exec();
    
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