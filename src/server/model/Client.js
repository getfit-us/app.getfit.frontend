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
        required: true
    },
    avatar_url: {
        type: String,

    },
    roles: {
        User: { type: Number, default: 1 },
        Client: { type: Number, default: 2 },
       
      
        
    }



});

module.exports = mongoose.model('Client', clientSchema);