const mongoose = require('mongoose');

const wsComment = new mongoose.Schema({
  userName: String,
  userID: String,
  eventID: String,
  text: String,
  eventType: String
});

exports.wsComment = mongoose.model('ws-comment', wsComment);
