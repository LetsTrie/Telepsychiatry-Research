const mongoose = require('mongoose');

const eUserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    dob: {
        type: String
    },
    affiliation: {
        type: String
    },
    country: {
        type: String
    },
    gender: {
        type: String
    },
    regno: {
        type: String
    },
    researchArea: {
        type: String
    },
    expertise: {
        type: String
    },
    designation: {
        type: String
    },
    speciality: {
        type: String
    },
    visitingFee: {
        type: String
    },
    institute: {
        type: String
    },
    professionalDegree: {
        type: String
    },
    aboutYourself: {
        type: String
    },
    education: [{
        institute: String,
        degree: String,
        eduFrom: String,
        eduTo: String
    }],
    training: [{
        name: String,
        year: String,
        description: String
    }],
    awards: [{
        name: String,
        year: String,
        description: String
    }],
    workExperience: [{
        institute: String,
        from: String,
        to: String
    }],
    visitingHour: [{
        chamberName: String,
        chamberAddress: String,
        chamberTimings: [{
            dayFrom: String,
            dayTo: String,
            timeFrom: String,
            timeTo: String
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.eUserModel = mongoose.model('expertUser', eUserSchema);