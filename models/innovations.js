const mongoose = require('mongoose');

const innovationsSchema = new mongoose.Schema({
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

exports.InnovationsModel = mongoose.model('innovation', innovationsSchema);
