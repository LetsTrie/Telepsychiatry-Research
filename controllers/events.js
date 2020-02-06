const events = require('../models/events')

exports.createEvent = (req, res, next) => {
    const {
        title,
        description,
        Location,
        datetime
    } = req.body

    console.log(datetime)
}