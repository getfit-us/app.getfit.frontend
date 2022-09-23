const User = require('../model/User');
const bcrypt = require('bcrypt');
const Token = require('../model/Token');
const {sendEmail} = require('../middleware/nodemailer');
const crypto = require('crypto');


const handleNewUser = async (req, res) => {
    const { email, password, firstName, lastName, phoneNum, password2, trainerId, goal, roles } = req.body;
 

    console.log(`register route: ${JSON.stringify(req.body)})}`);

    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    if (password !== password2) return res.status(400).json({ 'message': 'passwords do not match' });

   
        const duplicate = await User.findOne({ email: email }).exec();

        if (duplicate) return res.sendStatus(409);
    
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const result = await User.create({
                "firstname": firstName,
                "lastname": lastName,
                "phone": phoneNum,
                "email": email,
                "password": hashedPassword,
                "trainerId": trainerId,
                "goal": goal,
                "roles": roles
                    
            });
    
            console.log(result);

            const token = await new Token({
                userId: result._id,
                token: crypto.randomBytes(32).toString('hex')

            }).save()

            const url = `${process.env.BASE_URL}/verify/${result._id}/${token.token}`;
            await sendEmail(result, url,); //user object with link to verify account - userr / url
            console.log(url)
            res.sendStatus(201).json({ 'message': 'A Email has been sent to your account. Please verify your account' });
            // res.status(201).json(result);
    
        } catch (err) {
            // res.sendStatus(500).json({ 'message': err.message });
        }
    
    }



   
   





module.exports = { handleNewUser };