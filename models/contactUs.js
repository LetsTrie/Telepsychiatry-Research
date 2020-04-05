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
    mobile: {
        type: String,
        required: [true, 'Please Enter your mobile']
    },
    age: {
        type: String,
        required: [true, 'Please Enter your Age']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Please Select your Gender']
    },
    experts: {
        type: String,
        enum: ['Psychiatric Consultation', 'Psychology and Counselling'],
        required: [true, 'Please Select your Experts']
    },
    isReplied: {
        type: Boolean,
        default: false
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