const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    name: String,
    age: String,
    email: String,
    phoneNumber: String,
    bookingType: String,
    date: String,
    time: String,
    doctorId: String,
});

exports.appointment = mongoose.model('appointment', appointmentSchema);