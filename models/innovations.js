const mongoose = require('mongoose');

const innovationsSchema = new mongoose.Schema({
    title: String,
    description: String,
    name: String,
    designation: String,
    email: String,
    phone: String,
    collaboration: String,
    collabScope: String,
    newsAndPub: String,
    financialSupport: String,
    file: String,
    link: String,
    authorID: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('innovations', innovationsSchema);