const mongoose = require("mongoose");

const eUserSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    dob: {
        type: String
    },
    cAffiliation: {
        type: String
    },
    hADegree: {
        type: String
    },
    country: {
        type: String
    },
    gender: {
        type: String
    },
    identifyNo: {
        type: String
    },
    researchArea: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.eUserModel = mongoose.model("expertUser", eUserSchema);