const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsedExerciseSchema = new Schema({
    clientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    exercises: {
        type: Array,
        default: [],
        required: true
    }
   



});

UsedExerciseSchema.index({ createdAt: { type: Date, expires: '2d', default: Date.now}});

module.exports = mongoose.model('UsedExercise', UsedExerciseSchema);