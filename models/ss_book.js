const mongoose = require('mongoose');
const ssBookModel = new mongoose.Schema({
  patient_id: String,
  name: String,
  age: String,
  email: String,
  phoneNumber: String,
  bookingType: String,
  location: String,
  ss_id: String,
  ss_name: String,
  isConfirmed: {
    type: Boolean,
    default: false,
  },
});

exports.ssBookModel = mongoose.model('ss-booking', ssBookModel);
