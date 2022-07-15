const usersDB = {
    users: require('../model/db.json'),
    setUsers: function (data) {
        this.users = data
    }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);

    if (!email || !password) return res.status(400).json({message: 'Username and password are required.'});

    //check for duplicate username or Email

    const duplicate = usersDB.users.find(person => person.email === email)

    if (duplicate) return res.sendStatus(409)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {"email": email, "password": hashedPassword}
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));
        console.log(usersDB.users);
        res.status(200).json({ 'success' : `New user ${email} created successfully` });

    }  catch (err) {
        res.sendStatus(500).json({'message': err.message});
    }  
   



}

module.exports = { handleNewUser };