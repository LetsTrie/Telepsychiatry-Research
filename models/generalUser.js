const mongoose = require('mongoose');

const gUserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    dob: {
        type: String,
    },
    cAffiliation: {
        type: String,
    },
    hADegree: {
        type: String,
    },
    country: {
        type: String,
    },
    gender: {
        type: String,
    },
    propicURL: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

exports.gUserModel = mongoose.model('generalUser', gUserSchema);