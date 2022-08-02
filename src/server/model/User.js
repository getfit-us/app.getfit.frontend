const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        required: true
    },
    phone: {
        type: Number,
        
    },
    age: {
        type: Number,
        
    },
    avatar_url: {
        type: String,
    
    },
    trainerId: {
        type: String
    },
    goal: {
        type: String
    }, 
    roles: {
        User: { type: Number, default: 1 },
        Client: Number, 
        Admin: Number,
        Trainer: Number 
    } , 
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
    refreshToken : String



});

module.exports = mongoose.model('User', userSchema);