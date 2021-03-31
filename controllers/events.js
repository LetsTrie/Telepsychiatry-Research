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
const { eUserModel } = require('../models/expertUser.js');

exports.getTraining = (req, res, next) =>
  res.render('listOfTrainingSession', { user: req.user });
exports.getNewWorkshop = (req, res, next) =>
  res.render('add-new-workshop', { user: req.user });
exports.getNewTraining = (req, res, next) =>
  res.render('createNewTraining', { user: req.user });
exports.eventsAll = (req, res, next) =>
  res.render('eventShowAll', { user: req.user });

exports.singleWorkshop = async (req, res) => {
  const comments = await wsComment.find({ workshopID: req.params.id });
  if (!req.user) {
    const data = await workshopModel.findOne({ _id: req.params.id });

    const eUser = [];
    for (let i = 0; i < data.doctors.length; i++) {
      const doc = await eUserModel.findOne({ name: data.doctors[i] });
      eUser.push(doc);
    }

    res.render('single-workshop', {
      user: req.user,
      data,
      comments,
      ourExperts: eUser,
      registered: false,
    });
  } else {
    const data = await workshopModel.findOne({ _id: req.params.id });

    const eUser = [];
    for (let i = 0; i < data.doctors.length; i++) {
      const doc = await eUserModel.findOne({ name: data.doctors[i] });
      eUser.push(doc);
    }

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
    res.render('single-workshop', {
      user: req.user,
      data,
      comments,
      ourExperts: eUser,
      registered,
    });
  }
};

exports.getWorkshop = async (req, res, next) => {

  let workshops = await workshopModel.find()
  for (let ws of workshops) {
    // Object.assign(ws, { homepageDisplay: false })
    // await ws.save()
    console.log(ws.homepageDisplay)
  }

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

const { wsComment } = require('../models/workshopComment.js');
exports.addComment = async (req, res) => {
  console.log(req.body);
  const comment = {
    userName: req.user.name,
    userID: req.user._id,
    video: req.body.filename,
    ...req.body,
  };
  const newComment = wsComment(comment);
  console.log(newComment);
  await newComment.save();
  res.send({
    status: true,
  });
};
