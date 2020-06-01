const mongoose = require('mongoose');
const workshopReg = new mongoose.Schema({
    user_id: String,
    user_name: String,
    workshop_id: String,
});

exports.workshopReg = mongoose.model('workshopReg', workshopReg);