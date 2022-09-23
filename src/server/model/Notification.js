const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificaitonSchema = new Schema({
  //type can be reminder (goal, workout), message, or update from measurement and completed workouts

  type: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },

  //trainer will be able to grab all updates from their clients
  trainerID: {
    type: Schema.Types.ObjectId,

    ref: "User",
    unique: true,
  },
  message: { type: String, required: true },
  is_read: { type: Boolean, required: true , default: false },
  createdAt: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("Notification", notificaitonSchema);
