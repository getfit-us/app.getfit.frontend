const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');



const handleLogout = async (req, res) => {


    const cookies = req.cookies;



    if (!cookies?.jwt) return res.sendStatus(204);
    console.log(cookies.jwt, req.headers);
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) {
        res.clearCookie('jwt', refreshToken, {httpOnly: true,  sameSite: 'None', secure: true})

        return res.sendStatus(204);
    }

    // delete refresh token
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users));

    res.clearCookie('jwt', refreshToken, {httpOnly: true,  sameSite: 'None', secure: true})
    res.sendStatus(204);
}



module.exports = { handleLogout }