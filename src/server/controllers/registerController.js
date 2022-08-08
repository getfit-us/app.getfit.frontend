const User = require('../model/User');
const bcrypt = require('bcrypt');




const handleNewUser = async (req, res) => {
    const { email, password, firstName, lastName, phoneNum, password2, trainerId, goal } = req.body;
    let client = 0;
    if (trainerId) client = 2;

    console.log(`register route: ${email} ${password} ${trainerId}`);

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
                "roles": {
                    User: 1,
                    Client: client,
                   

                },
            });
    
            console.log(result);
    
            res.status(201).json(result);
    
        } catch (err) {
            res.sendStatus(500).json({ 'message': err.message });
        }
    
    }



   
   





module.exports = { handleNewUser };