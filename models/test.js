const mongoose = require('mongoose');

const testModel = new mongoose.Schema({
  testEng: {
    type: String,
  },
  testBan: {
    type: String,
  },
  disorderNameEng: {
    type: String,
  },
  disorderNameBan: {
    type: String,
  },
  age: {
    type: String,
  },
  isPaid: {
    type: String,
  },
  payAmount: {
    type: String,
  },
  language: {
    type: [String],
  },
  questionSet: [
    {
      language: String,
      Questions: [
        {
          question: String,
          scale: {
            type: String,
            default: '1',
          },
          Options: [
            {
              option: String,
              scale: {
                type: Number,
                default: '1',
              },
            },
          ],
        },
      ],
    },
  ],
});

exports.testModel = mongoose.model('assessTest', testModel);
