const User = require('../model/User');


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
    res.json(result);
  
  
  }



const getAllUsers = async (req, res) => {
    console.log('getallusers route')
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    console.log('deleteUser route')
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body._id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body._id });
    res.json(result);
}

const getUser = async (req, res) => {
    console.log('get user params route')
   

    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }

    // check if request is admin or current user
    if (req?.body?.clientId === user._id) {
        console.log(user);

    }

    if (req?.body?.role.includes(10)) {
        res.json(user);
    }


   
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUsers
}