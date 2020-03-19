const mongoose = require('mongoose');

const addDoctorSchema = new mongoose.Schema({
  name: String,
  gender: String,
  expertizeArea: String,
  Designation: String,
  Institute: String,
  fee: String,
  aboutYourself: String,
  education: [
    {
      InstituteName: String,
      Degree: String,
      year: [Number]
    }
  ],
  workExperience: [
    {
      name: String,
      details: String
    }
  ],
  services: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

exports.addDoctorModel = mongoose.model('addDoctor', addDoctorSchema);
