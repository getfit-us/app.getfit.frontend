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
        type: String,
        
    },
    age: {
        type: Number,
        
    },
    height: {
        type:String
    },
    avatar: {
       type: String
    
    },
    trainerId: {
        type: String
    },
    goal: {
        type: Array
    }, 
    roles: {
        User: { type: Number, default: 1 },
        Client: Number, 
        Admin: Number,
        Trainer: Number 
    } , 
    date: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false
    },
    NotificationSettings: {
        email: { type: Boolean, default: true },
        workouts: { type: Boolean, default: true },
        goals: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        
    },
    refreshToken : String



});

module.exports = mongoose.model('User', userSchema);