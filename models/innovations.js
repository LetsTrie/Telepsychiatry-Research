const mongoose = require('mongoose');

const innovationsSchema = new mongoose.Schema({
  createdBy: {
    type: Number,
    default: 123456
  },
  title: {
    type: String,
    required: [true, 'Add a title']
  },
  tags: {
    type: [String],
    required: [true, 'Add a tag']
  },
  projectType: {
    type: String,
    required: [true, 'Select page type']
  },
  objective: {
    type: String,
    required: [true, 'Add an objective']
  },
  description: {
    type: String,
    required: [true, 'Add a brief description']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('innovations', innovationsSchema);
