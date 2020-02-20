// const { eventsModel } = require('../models/events')

// exports.getEvents = async(req, res, next) => {
//     const events = await eventsModel.find()
//     res.render('events', {
//         posts: events
//     })
// }

// exports.createEvent = async(req, res, next) => {
//     const {
//         title,
//         description,
//         location,
//         date,
//         time
//     } = req.body

//     const newEvent = await new eventsModel({
//         title,
//         description,
//         location,
//         date,
//         time
//     }).save()

//     console.log(newEvent)
//     req.flash('created', 'event created')
//     res.redirect('/events')
// }

exports.getWorkshop = (req, res, next) => res.render('listOfWorkshop');
exports.getTraining = (req, res, next) => res.render('listOfTrainingSession');
exports.getNewWorkshop = (req, res, next) => res.render('createNewWorkshop');
exports.getNewTraining = (req, res, next) => res.render('createNewTraining');
exports.eventsAll = (req, res, next) => res.render('eventShowAll');
