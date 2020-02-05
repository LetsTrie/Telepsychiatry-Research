var mongoose = require('mongoose');

// Post Schema
var ResourceSchema = mongoose.Schema({
  title: {
    type: String
  },
  authors: {
    type: String
  },
  pageType: {
    type: String
  },
  publicationYear: {
    type: String
  },
  summary: {
    type: String
  },
  description: {
    type: String
  }
});

var Resource = module.exports = mongoose.model('Resource', ResourceSchema);