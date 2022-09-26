const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificaitonSchema = new Schema({
  //type can be reminder (goal, workout), message, or activity from measurement and completed workouts
  //type [goal, message, activity, task, reminder]

  type: {
    type: String,
    required: true,
  },
  sender: {
    name: String,
    id: {type: String, required: true},
   
  },
  receiver: {
    name: String,
    id: {type: String, required: true},
   
  },
  activityID: {type: String},
  liked: {type: Boolean},


  message: { type: String, required: true },
  is_read: { type: Boolean, required: true , default: false },
  createdAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("Notification", notificaitonSchema);
