const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,

    },
    phone: {
        type: Number,

    },
    age: {
        type: Number,
        
    },
    avatar_url: {
        type: Buffer,

    }, 
    trainerId: {
        type: String
    },
    goal: {
        type: String
    }, 
    bodyMetrics: {
        date: {
            type: String,
            bodyFat: {
                type: Number
            },
            weight: {
                type: Number
            },
            progressPic: {
                type: Buffer
            }

        },


    },



    roles: {
        User: { type: Number, default: 0 },
        Client: { type: Number, default: 2 },



    }



});

module.exports = mongoose.model('Client', clientSchema);