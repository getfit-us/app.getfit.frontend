const Notification = require("../model/Notification");
const User = require("../model/User");


const getSender= async (req, res) => {
  //get user name with id for notifications
  if (!req.params['id']) res.status(404).send({ message: 'Not Found' });

  const user = await User.findOne({ _id: req.params["id"] }).exec();
  if (!user) res.status(404).send({ message: 'Not Found' });

  const userName = user.firstname + " " + user.lastname;

  return res.status(200).send(userName);



}



const getNotification = async (req, res, next) => {
  // get notifications for current user
  console.log(`get notification api call`);
  if (!req.params["id"])
    return res.status(404).json({ message: "You must specify an client ID" });
  // if user id is not linked to any exercise then return 404
  const foundNotifications = await Notification.find({
    receiver: {id: req.params["id"] } ,
  }).exec();
  //if nothing found send 404
  if (!foundNotifications)
    return res.status(404).json({ message: "Not Found" });
  
 //********* -- this needs to be done -----make a aggregation request to get all users names and replace sender ids
  
    // return results if found




  return res.status(200).json(foundNotifications);
};

const delNotification = async (req, res) => {
    console.log(`del notification called`);
  const id = req.params["id"];

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "notification ID required" });
  const notification = await Notification.findOne({ _id: id }).exec();

  if (!notification) return res.status(204).json({ message: "no notification found" }); // no content

  const result = await notification.deleteOne({ _id: id });
  res.json(result);
};

const createNotification = async (req, res) => {
  console.log(`create notification route`);
  const {  type, sender, receiver, trainerID, message,  } = req.body;

  if (!type || !sender || !receiver || !message ) {
    return res.status(400).json({ message: "type, sender, receiver, message and Id are required" });
  }




  try {
    const result = await Notification.create({
      type: type,
      sender: sender,
      receiver: receiver,
      trainerID: req.body?.trainerID? trainerID : "",
      message: message,
      
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
};

const updateNotification = async (req, res) => {
  console.log('update notification route');
  
  if (!req.body._id) return res.status(400).json({ message: "notification ID required" });

  // find notification to edit
  const notification = await Notification.findOne({ _id: req.body._id }).exec();
  if (!notification) return res.status(404).json({ message: "not found" }); // no content

   if (req.body?.is_read) notification.is_read = req.body.is_read;
  const result= await   notification.save();

    console.log(`update notification route`);

  res.status(201).json(result);
}


const getClientNotifications = async (req, res) => {};

module.exports = {
  getClientNotifications,
  createNotification,
  delNotification,
  getNotification,
  updateNotification,
  getSender
};