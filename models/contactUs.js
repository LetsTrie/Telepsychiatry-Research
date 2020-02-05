const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please Enter your name']
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email']
    },
    message: {
      type: String,
      required: [true, 'Please Enter your message']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
});

exports.contactUsModel = mongoose.model('contactUs', contactUsSchema);
