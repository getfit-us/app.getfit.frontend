const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    clientId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    cardio: {
        type: Boolean,

    },
    rating: {
        type: Number,

    },
    exercises: {
        type: Object,
        required: true,
        default: {}
    },
   
  


});

module.exports = mongoose.model('Workout', WorkoutSchema);