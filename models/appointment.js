const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    name: String,
    age: String,
    email: String,
    phoneNumber: String,
    bookingType: String,
    date: String,
    time: String,
    startTime: String,
    location: String,
    doctorId: String,
    isConfirmed: {
        type: Boolean,
        default: false,
    },
});

exports.appointment = mongoose.model('appointment', appointmentSchema);