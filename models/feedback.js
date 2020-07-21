const mongoose = require('mongoose');
const Feedback = new mongoose.Schema({
  user_id: String,
  user_name: String,
  service_id: String,
  body: String,
  video: String,
  service: String,
  onDisplay: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

exports.Feedback = mongoose.model('feedback', Feedback);
