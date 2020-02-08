const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    }
});

exports.eventsModel = mongoose.model('events', eventsSchema);