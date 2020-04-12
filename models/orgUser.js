const mongoose = require('mongoose');

const orgUserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    authPhoneNumber: {
        type: String,
    },
    authName: {
        type: String,
    },
    region: {
        type: String,
    },
    password: {
        type: String,
    },
    org_type: {
        type: String,
    },
    websiteLink: {
        type: String,
    },
    establish_year: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

exports.orgUserModel = mongoose.model('orgUser', orgUserSchema);