const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//For Creating Custom Workout Routines to assign to clients

const CustomWorkoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  clientId: {
    //id of client or trainer who created the customWorkout
    
    type: String,
  },
  Created: {
    type: Date,
    default: Date.now
    
  },

  exercises: {
    //going to contain array of exercise objects
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("CustomWorkout", CustomWorkoutSchema);
