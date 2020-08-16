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
  schedule: {
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
  },
  start: Date,
  end: Date,
  image: String,
});

exports.workshopModel = mongoose.model('workshop', eventsSchema);
