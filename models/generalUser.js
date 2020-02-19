const mongoose = require("mongoose");

const gUserSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.gUserModel = mongoose.model("generalUser", gUserSchema);