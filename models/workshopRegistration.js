const mongoose = require('mongoose');
const workshopReg = new mongoose.Schema({
    user_id: String,
    user_name: String,
    event_id: String,
    event_type: String
});

exports.workshopReg = mongoose.model('workshopReg', workshopReg);