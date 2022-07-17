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
        required: true
    },
    phone: {
        type: Number,
        
    },
    roles: {
        User: { type: Number, default: 1 },
        Client: { type: Number, default: 2 }, 
        Admin: Number 
    }



});

module.exports = mongoose.model('Client', clientSchema);