const mongoose = require('mongoose');

const testModel = new mongoose.Schema({
    testEng: {
        type: String,
    },
    testBan: {
        type: String,
    },
    testEng: {
        type: String,
    },
    nameEng: {
        type: String,
    },
    nameBan: {
        type: String,
    },
    age: {
        type: String,
    },
    paidInput: {
        type: String,
    },
    payAmount: {
        type: String,
    },
    questions: [{
        questionEng: String,
        questionBan: String,
        Options: [{
            optionEng: String,
            optionBan: String,
            scale: String,
        }, ],
    }, ],
});

exports.testModel = mongoose.model('assessTest', testModel);