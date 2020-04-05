const mongoose = require('mongoose');

const eUserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    dob: {
        type: String,
    },
    affiliation: {
        type: String,
    },
    country: {
        type: String,
    },
    gender: {
        type: String,
    },
    regno: {
        type: String,
    },
    researchArea: {
        type: String,
    },
    expertise: {
        type: String,
    },
    designation: {
        type: String,
    },
    speciality: {
        type: String,
    },
    fee: {
        type: String,
    },
    institute: {
        type: String,
    },
    professionalDegree: {
        type: String,
    },
    aboutYourself: {
        type: String,
    },
    propicURL: {
        type: String,
    },
    cvURL: {
        type: String,
    },
    education: [{
        eduInstitute: String,
        degree: String,
        eduFrom: String,
        eduTo: String,
    }, ],
    training: [{
        trainingName: String,
        trainingYear: String,
        trainingDetails: String,
    }, ],
    awards: [{
        awardsName: String,
        awardsYear: String,
        awardsDetails: String,
    }, ],
    workExperience: [{
        expInstitute: String,
        expFrom: String,
        expTto: String,
    }, ],
    visitingHour: [{
        chamberName: String,
        chamberAddress: String,
        shifts: [{
            dayFrom: String,
            dayTo: String,
            timeFrom: String,
            timeTo: String,
        }, ],
    }, ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

exports.eUserModel = mongoose.model('expertUser', eUserSchema);