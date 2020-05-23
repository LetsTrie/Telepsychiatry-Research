const mongoose = require('mongoose');
const emergencySchema = new mongoose.Schema({
    service: String,
    name: String,
    email: String,
    phoneNumber: String,
    age: String,
});

exports.Emergency = mongoose.model('emergency', emergencySchema);