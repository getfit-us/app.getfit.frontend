const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//For Creating Custom Workout Routines to assign to clients

const CompletedWorkoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  clientId: {
    //id of client who completed the workout
    
    type: String,
  },
  Created: {
    type: Date,
    default: Date.now
    
  },
  dateCompleted: {
    type: String,
    required: true
  },

  exercises: {
    //going to contain array of exercise objects
    type: Array,
    required: true,
    default: [],
  },
 
  feedback: {
    type: String,

  },
  rating: {
    type: Number,
  },
});

module.exports = mongoose.model("CompletedWorkout", CompletedWorkoutSchema);