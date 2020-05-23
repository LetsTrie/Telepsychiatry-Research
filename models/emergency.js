const mongoose = require('mongoose');
const emergencySchema = new mongoose.Schema({
    service: String,
    name: String,
    email: String,
    phoneNumber: String,
    age: String,
    status: {
        type: String,
        default: 'unseen',
    },
    doctorID: {
        type: String,
        default: 'none',
    },
});

exports.Emergency = mongoose.model('emergency', emergencySchema);