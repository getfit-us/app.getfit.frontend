const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//For Creating Custom Workout Routines to assign to clients

const CustomWorkoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  clientId: {
    type: String,
  },

  type: {
    type: String,
    required: true,
  },
  cardio: {
    length: {
      type: Number,
    },
  },

  exercises: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("CustomWorkout", CustomWorkoutSchema);
