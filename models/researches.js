const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: String,
  description: String,
  // name: String,
  // designation: String,
  // email: String,
  // phone: String,
  // collaboration: String,
  // collabScope: String,
  // newsAndPub: String,
  researchStage: String,
  priority: {
    type: Number,
  },
  file: String,
  authorID: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

exports.ResearchModel = mongoose.model('researches', researchSchema);
