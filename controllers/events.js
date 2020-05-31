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
const { workshopModel } = require('../models/workshop.js');
exports.getWorkshop = async(req, res, next) => {
    const { type } = req.query;
    let data;
    if (type) {
        if (type == 'current') {
            data = await workshopModel.find({
                start: { $lte: new Date() },
                end: { $gte: new Date() },
            });
            res.render('all-workshops', {
                data,
                user: req.user,
            });
        } else if (type == 'past') {
            data = await workshopModel.find({
                end: { $lte: new Date() },
            });
            res.render('all-workshops', {
                data,
                user: req.user,
            });
        } else if (type == 'upcoming') {
            data = await workshopModel.find({
                start: { $gte: new Date() },
            });
            res.render('all-workshops', {
                data,
                user: req.user,
            });
        }
    }
    data = await workshopModel.find();
    res.render('all-workshops', { data, user: req.user });
};
exports.getTraining = (req, res, next) =>
    res.render('listOfTrainingSession', { user: req.user });
exports.getNewWorkshop = (req, res, next) =>
    res.render('add-new-workshop', { user: req.user });
exports.getNewTraining = (req, res, next) =>
    res.render('createNewTraining', { user: req.user });
exports.eventsAll = (req, res, next) =>
    res.render('eventShowAll', { user: req.user });

exports.workshopFile = async(req, res) => {
    console.log('Workshop file added');
    res.redirect('/events/workshop');
};

exports.postWorkshop = async(req, res) => {
    const { title, description, location, image } = req.body;
    const schedule = JSON.parse(req.body.schedule);
    const sdate = schedule.startDate.split('/');
    const stime = schedule.startTime.split(':');
    let x = parseInt(stime[0]);
    let y = ('0' + parseInt(stime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
    if (schedule.startTime[6] == 'P') {
        x = parseInt(stime[0]) + 12;
    }
    console.log(sdate);
    let start =
        sdate[2] +
        '-' +
        sdate[0] +
        '-' +
        sdate[1] +
        ' ' +
        '00' +
        ':' +
        y +
        ':00:00';
    console.log(start);
    start = new Date(sdate[2], parseInt(sdate[0]) - 1, sdate[1], 13, 0, 0, 0);
    console.log(start);

    const edate = schedule.endDate.split('/').map((x) => parseInt(x));
    const etime = schedule.endTime.split(':');
    let a = parseInt(etime[0]);
    let b = parseInt(etime[1].split(' ')[0]);
    if (schedule.endTime[6] == 'P') {
        a = parseInt(etime[0]) + 12;
    }
    const end = new Date(edate[2], edate[1] - 1, edate[0], a - 18, b, 0, 0);
    console.log(end);

    obj = {
        title,
        description,
        location,
        schedule,
        start,
        end,
        image,
    };
    const newWorkshop = new workshopModel(obj);
    console.log(newWorkshop);
    // await newWorkshop.save();
    res.send({
        status: true,
        msg: 'Workshop created',
    });
};

exports.singleWorkshop = async(req, res) => {
    console.log('sin');
    const data = await workshopModel.findOne({ _id: req.params.id });
    res.render('single-workshop', {
        user: req.user,
        data,
    });
};