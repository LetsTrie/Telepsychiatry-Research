const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Add a title']
    },
    authors: {
      type: [String],
      required: [true, 'Add an author']
    },
    pageType: {
      type: String,
      required: [true, 'Select page type']
    },
    publicationYear: {
      type: String,
      required: [true, 'Select publication year']
    },
    summary: {
      type: String,
      required: [true, 'Add a summary']
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

exports.ResearchModel = mongoose.model('researches', researchSchema);
