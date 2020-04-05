const mongoose = require('mongoose');

const addDoctorSchema = new mongoose.Schema({
    name: String,
    gender: String,
    expertise: String,
    designation: String,
    institute: String,
    fee: String,
    aboutYourself: String,
    education: [{
        instituteName: String,
        degree: String,
        eduFrom: String,
        eduTo: String
    }],
    workExperience: [{
        name: String,
        inDetails: String
    }],
    services: [String],
    dob: String,
    email: String,
    visitingHour: [String],
    speciality: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.addDoctorModel = mongoose.model('addDoctor', addDoctorSchema);