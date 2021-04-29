const { workshopModel } = require('../models/workshop.js');
const { trainingModel } = require('../models/training.js');
const { workshopReg } = require('../models/workshopRegistration.js');
const { eUserModel } = require('../models/expertUser.js');

// Training Sessions

exports.getTraining = async (req, res, next) => {

  let workshops = await trainingModel.find()

  let { type, search } = req.query;
  let data;
  let regList = [];
  if (req.user) {
    regList = await workshopReg.find({ user_id: req.user._id, event_type: 'Training Session' });
    regList = regList.map(reg => reg.event_id)
  }
  console.log(regList)
  if (type) {
    if (type == 'current') {
      data = await trainingModel.find({
        start: { $lte: new Date() },
        end: { $gte: new Date() },
      });
      res.render('allTrainings', {
        data,
        user: req.user,
        regList,
      });
    } else if (type == 'past') {
      data = await trainingModel.find({
        end: { $lte: new Date() },
      });
      res.render('allTrainings', {
        data,
        user: req.user,
        regList,
      });
    } else if (type == 'upcoming') {
      data = await trainingModel.find({
        start: { $gte: new Date() },
      });
      res.render('allTrainings', {
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
    data = await trainingModel.find({
      $or: [
        { title: searchOptions },
        { description: searchOptions },
        { location: searchOptions },
      ],
    });
    return res.render('allTrainings', {
      data,
      user: req.user,
      regList,
    });
  }
  data = await trainingModel.find().sort({ _id: -1 });
  res.render('allTrainings', { data, user: req.user, regList });
};

exports.singleTraining = async (req, res) => {
  const comments = await wsComment.find({ eventID: req.params.id, eventType: 'training' });
  if (!req.user) {
    const data = await trainingModel.findOne({ _id: req.params.id });

    const eUser = [];
    for (let i = 0; i < data.doctors.length; i++) {
      const doc = await eUserModel.findOne({ name: data.doctors[i] });
      eUser.push(doc);
    }

    res.render('singleTraining', {
      user: req.user,
      data,
      comments,
      ourExperts: eUser,
      registered: false,
    });
  } else {
    const data = await trainingModel.findOne({ _id: req.params.id });

    const eUser = [];
    for (let i = 0; i < data.doctors.length; i++) {
      const doc = await eUserModel.findOne({ name: data.doctors[i] });
      eUser.push(doc);
    }

    let regList = await workshopReg.find({ user_id: req.user._id, event_type: 'Training Session' });
    const registered = regList.map(reg => reg.event_id).includes(data._id.toString())
    console.log(registered)

    res.render('singleTraining', {
      user: req.user,
      data,
      comments,
      ourExperts: eUser,
      registered,
    });
  }
};

exports.regForTraining = async (req, res) => {
  if (!req.user) {
    req.flash('errorMessage', 'Sign in to register for this training sessoin');
    res.redirect('back');
  } else {
    const obj = {
      user_id: req.user._id,
      user_name: req.user.name,
      event_id: req.params.id,
      event_type: 'Training Session'
    };
    const newWR = new workshopReg(obj);
    console.log(req.params.id);
    await newWR.save();
    req.flash(
      'successMessage',
      'You have successfully registered to this training session.'
    );
    res.redirect('back');
  }
};

// Workshops

exports.getNewWorkshop = (req, res, next) =>
  res.render('add-new-workshop', { user: req.user });
exports.getNewTraining = (req, res, next) =>
  res.render('createNewTraining', { user: req.user });

exports.singleWorkshop = async (req, res) => {
  const comments = await wsComment.find({ eventID: req.params.id, eventType: 'workshop' });
  if (!req.user) {
    const data = await workshopModel.findOne({ _id: req.params.id });

    const eUser = [];
    for (let i = 0; i < data.doctors.length; i++) {
      const doc = await eUserModel.findOne({ name: data.doctors[i] });
      if (doc != null) eUser.push(doc);
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

    let regList = await workshopReg.find({ user_id: req.user._id, event_type: 'Workshop' });
    const registered = regList.map(reg => reg.event_id).includes(data._id.toString())

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
  let workshops = await workshopModel.find();
  for (let ws of workshops) {
    // Object.assign(ws, { homepageDisplay: false })
    // await ws.save()
    console.log(ws.homepageDisplay);
  }

  let { type, search } = req.query;
  let data;
  let regList = [];
  if (req.user) {
    regList = await workshopReg.find({ user_id: req.user._id, event_type: 'Workshop' });
    regList = regList.map(reg => reg.event_id)
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
      event_id: req.params.id,
      event_type: 'Workshop'
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
    ...req.body,
  };
  const newComment = wsComment(comment);
  console.log(newComment);
  await newComment.save();
  res.send({
    status: true,
  });
};
