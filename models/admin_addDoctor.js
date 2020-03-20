const mongoose = require('mongoose');

const addDoctorSchema = new mongoose.Schema({
    name: String,
    gender: String,
    expertizeArea: String,
    designation: String,
    institute: String,
    fee: String,
    aboutYourself: String,
    education: [{
        instituteName: String,
        degree: String,
        year: [String]
    }],
    workExperience: [{
        name: String,
        details: String
    }],
    services: [String],
    dob: String,
    email: String,
    visitingTime: [String],
    speciality: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.addDoctorModel = mongoose.model('addDoctor', addDoctorSchema);