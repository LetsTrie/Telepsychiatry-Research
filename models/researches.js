const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
    title: {
        type: String
    },
    BriefDesciption: {
        type: String
    },
    conflictOfInterest: {
        type: String
    },
    financialSupport: {
        type: String
    },
    Acknowlegement: {
        type: String
    },
    references: {
        type: String
    },
    authors: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

exports.ResearchModel = mongoose.model('researches', researchSchema);