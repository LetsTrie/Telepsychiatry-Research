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
    Age: {
        type: Number,
        required: [true, 'Please Enter your Age']
    },
    Gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, 'Please Select your Gender']
    },
    Experts: {
        type: String,
        enum: ["psychiatric consultation", "psychology and counselling"],
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