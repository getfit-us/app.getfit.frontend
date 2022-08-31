const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//For clients to log the workout info

const WorkoutSchema = new Schema({
  clientId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  cardio: {
    length: {
      type: Number,
    },
    completed: {
      type: Boolean,
    },
  },
  rating: {
    type: Number,
  },
  exercises: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("Workout", WorkoutSchema);
