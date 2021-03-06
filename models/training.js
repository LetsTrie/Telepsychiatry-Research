const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  about: {
    type: String,
  },
  videos: [String],
  location: {
    type: String,
  },
  doctors: [String],
  schedule: {
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
  },
  start: Date,
  end: Date,
  faqs: String,
  image: String,
  certificate: String,
  homepageDisplay: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
  },
});

exports.trainingModel = mongoose.model('training', eventsSchema);
