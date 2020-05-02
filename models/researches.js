const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: String,
  description: String,
  contactPerson: String,
  collaboration: String,
  collabScope: String,
  newsAndPub: String,
  researchStage: String,
  financialSupport: String,
  file: String,
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
