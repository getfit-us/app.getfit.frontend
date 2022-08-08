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
  
    refreshToken : String



});

module.exports = mongoose.model('User', userSchema);