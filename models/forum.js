const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: [true, 'Add a description']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports.forumModel = mongoose.model('forum', forumSchema);
