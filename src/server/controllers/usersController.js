const User = require('../model/User');
const jwt = require('jsonwebtoken');


const updateUsers = async (req, res) => {

    console.log('update user route');

    if (!req?.body?._id) {
        return res.status(400).json({ 'message': 'ID  required' })
    }
    const user = await User.findOne({ _id: req.body._id }).exec();
    if (!user) { return res.status(204).json({ 'message': `no user matches ID ${req.body.user}` }) };

    if (req?.body?.firstname) user.firstname = req.body.firstname;
    if (req?.body?.lastname) user.lastname = req.body.lastname;
    if (req?.body?.email) user.email = req.body.email;
    if (req?.body?.phone) user.phone = req.body.phone;
    if (req?.body?.avatar) user.avatar = req.body.avatar;
    if (req?.body?.trainerId) user.trainerId = req.body.trainerId;
    if (req?.body?.roles) user.roles = req.body.roles;


    const result = await user.save();
    console.log(`User Update: ${result}`)
    res.json(result);


}



const getAllUsers = async (req, res) => {
    console.log('getallusers route')
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    console.log(`client delete route ${req.params['id']}`);

    if (!req.params['id']) return res.status(400).json({ 'message': 'Client ID required' });

    const user = await User.findOne({ _id: req.params['id'] }).exec();
    if (!user) { return res.status(204).json({ 'message': `no client matches ID ${req.body.id}` }) };

    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    console.log('get user params route')


    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }

    res.json(user);


}


const getTrainer = async (req, res) => {
    console.log(`get Trainer Route`);


    if (!req?.params?.id) return res.status(400).json({ "message": 'Trainer ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }


    // return the trainer contact details

    res.json({ firstname: user.firstname, lastname: user.lastname, phone: user.phone, email: user.email });



}


const updateSelf = async (req, res) => {
    console.log(`update self route`);
    //allow current user to update there profile or info
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }

    //verify current request is trying to modify only their account

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

   if (user.refreshToken !== refreshToken) return res.sendStatus(403);

    if (req?.body?.firstname) user.firstname = req.body.firstname;
    if (req?.body?.lastname) user.lastname = req.body.lastname;
    if (req?.body?.email) user.email = req.body.email;
    if (req?.body?.phone) user.phone = req.body.phone;
    if (req?.body?.goals) user.goal = req.body.goals;





}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUsers,
    getTrainer,
    updateSelf
}