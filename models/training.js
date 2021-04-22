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
  image: String,
  homepageDisplay: {
    type: Boolean,
    default: false
  }
});

exports.trainingModel = mongoose.model('training', eventsSchema);
