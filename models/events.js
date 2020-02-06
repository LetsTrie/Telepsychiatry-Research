const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    tile: {
        type: String
    },
    description: {
        type: String
    },
    Location: {
        type: String
    },
    datetime: {
        type: String
    }
});

exports.eventsModel = mongoose.model('events', eventsSchema);