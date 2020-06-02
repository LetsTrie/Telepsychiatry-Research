const mongoose = require('mongoose');
const ssModel = new mongoose.Schema({
    title: String,
    description: String,
    details: String,
    image: String,
    doctors: [String],
});

exports.ssModel = mongoose.model('special-services', ssModel);