const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSchema = new Schema({



    date: {
        type: String,
        required: true,
       
    },
    clientId: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },

    images: {
        type: Array,

    },
    bodyfat: {
        type: Number,
    }




});

module.exports = mongoose.model('Measurement', measurementSchema);