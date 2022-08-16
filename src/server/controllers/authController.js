const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// need to add checks for email is verified before allowing login



const handleLogin = async (req, res) => {
    const cookies = req.cookies;



    const { email, password } = req.body;
    console.log(`Auth route hit: ${req.url} email:${email} password:${password}`);



    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    const foundUser = await User.findOne({ email }).exec();
    console.log(`found user: ${foundUser?.email}`);
    if (!foundUser) { return res.sendStatus(401); } //Unauthorized 


    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }

            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        );

        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        const firstName = foundUser.firstname;
        const lastName = foundUser.lastname;
        const trainerId = foundUser?.trainerId;
        const phone = foundUser?.phone;
        const age = foundUser?.age;
        const goal = foundUser?.goal;
        const startDate = foundUser?.date;
        const avatar = foundUser?.avatar;


        const clientId = foundUser._id

        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ roles, accessToken, firstName,lastName, email, trainerId,  clientId, phone, age, goal, startDate, avatar });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };