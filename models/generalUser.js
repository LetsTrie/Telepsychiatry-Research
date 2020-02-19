const mongoose = require('mongoose');

const gUserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  cAffiliation: {
    type: String,
    required: true
  },
  hADegree: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  propicURL: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

exports.gUserModel = mongoose.model('generalUser', gUserSchema);
