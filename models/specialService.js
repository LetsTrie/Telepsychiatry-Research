const mongoose = require('mongoose');
const ssModel = new mongoose.Schema({
  title: String,
  subTitle: String,
  description: String,
  details: String,
  fee: String,
  schedule: {
    weekDay: String,
    start: String,
    end: String,
  },
  alottedPatients: {
    type: Number,
    default: 0,
  },
  image: String,
  videos: [String],
  doctorIDs: [String],
  doctorNames: [String],
});

exports.ssModel = mongoose.model('special-services', ssModel);
