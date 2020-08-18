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
const { workshopReg } = require('../models/workshopRegistration.js');

exports.getTraining = (req, res, next) =>
  res.render('listOfTrainingSession', { user: req.user });
exports.getNewWorkshop = (req, res, next) =>
  res.render('add-new-workshop', { user: req.user });
exports.getNewTraining = (req, res, next) =>
  res.render('createNewTraining', { user: req.user });
exports.eventsAll = (req, res, next) =>
  res.render('eventShowAll', { user: req.user });

exports.singleWorkshop = async (req, res) => {
  if (!req.user) {
    // for displaying doctors list in the page (temporary)
    const eUser = require('../data/homepage_experts');

    const data = await workshopModel.findOne({ _id: req.params.id });
    res.render('single-workshop', {
      user: req.user,
      data,
      ourExperts: eUser,
      registered: false,
    });
  } else {
    const data = await workshopModel.findOne({ _id: req.params.id });
    let regList = [];
    let registered = false;
    const arr = await workshopReg.find({ user_id: req.user._id });
    for (let i = 0; i < arr.length; i++) {
      regList.push(arr[i].workshop_id);
    }
    if (regList.includes(data._id.toString())) {
      registered = true;
    }
    console.log(registered);

    // for displaying doctors list in the page (temporary)
    const eUser = require('../data/homepage_experts');

    res.render('single-workshop', {
      user: req.user,
      data,
      ourExperts: eUser,
      registered,
    });
  }
};

exports.getWorkshop = async (req, res, next) => {
  let { type, search } = req.query;
  let data;
  let regList = [];
  if (req.user) {
    const arr = await workshopReg.find({ user_id: req.user._id });
    for (let i = 0; i < arr.length; i++) {
      regList.push(arr[i].workshop_id);
    }
  }
  if (type) {
    if (type == 'current') {
      data = await workshopModel.find({
        start: { $lte: new Date() },
        end: { $gte: new Date() },
      });
      res.render('all-workshops', {
        data,
        user: req.user,
        regList,
      });
    } else if (type == 'past') {
      data = await workshopModel.find({
        end: { $lte: new Date() },
      });
      res.render('all-workshops', {
        data,
        user: req.user,
        regList,
      });
    } else if (type == 'upcoming') {
      data = await workshopModel.find({
        start: { $gte: new Date() },
      });
      res.render('all-workshops', {
        data,
        user: req.user,
        regList,
      });
    }
  }
  if (search) {
    console.log(search);
    search = search.trim();
    let searchOptions = {
      $regex: search,
      $options: 'i',
    };
    data = await workshopModel.find({
      $or: [
        { title: searchOptions },
        { description: searchOptions },
        { location: searchOptions },
      ],
    });
    return res.render('all-workshops', {
      data,
      user: req.user,
      regList,
    });
  }
  data = await workshopModel.find().sort({ _id: -1 });
  res.render('all-workshops', { data, user: req.user, regList });
};

exports.regForWorkshop = async (req, res) => {
  if (!req.user) {
    req.flash('errorMessage', 'Sign in to register for this workshop');
    res.redirect('back');
  } else {
    const obj = {
      user_id: req.user._id,
      user_name: req.user.name,
      workshop_id: req.params.id,
    };
    const newWR = new workshopReg(obj);
    console.log(req.params.id);
    await newWR.save();
    req.flash(
      'successMessage',
      'You have successfully registered to this workshop.'
    );
    res.redirect('back');
  }
};
