const mongoose = require('mongoose');

const wsComment = new mongoose.Schema({
  userName: String,
  userID: String,
  workshopID: String,
  text: String,
  video: {
    type: String,
    default: 'none',
  },
});

exports.wsComment = mongoose.model('ws-comment', wsComment);
