const mongoose = require('mongoose');
const ssModel = new mongoose.Schema({
  title: String,
  subTitle: String,
  description: String,
  details: String,
  image: String,
  videos: [String],
  doctorIDs: [String],
  doctorNames: [String],
});

exports.ssModel = mongoose.model('special-services', ssModel);
