const { eventsModel } = require('../models/events')

exports.getEvents = async(req, res, next) => {
    const events = await eventsModel.find()
    res.render('events', {
        posts: events
    })
}

exports.createEvent = async(req, res, next) => {
    const {
        title,
        description,
        location,
        date,
        time
    } = req.body

    const newEvent = await new eventsModel({
        title,
        description,
        location,
        date,
        time
    }).save()

    console.log(newEvent)
    req.flash('created', 'event created')
    res.redirect('/events')
}