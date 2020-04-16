const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');
const { ResearchModel } = require('../models/researches');
const InnovationModel = require('../models/innovations');
const { addDoctorModel } = require('../models/admin_addDoctor');
const { addDoctorValidation } = require('../validations/admin_addDoctor');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { makeSmallParagraphFromHTML } = require('./utils');
const { testModel } = require('../models/test');

const LIMIT = 9;
const admin = {
  id: 'admin123',
  name: 'admin',
  email: 'admin@trin',
  password: '123456',
};
const checker = async (req, res) => {
  if (req.user) {
    const logged = JSON.stringify(admin) == JSON.stringify(req.user);
    if (!logged) {
      return res.redirect('/admin/login');
    }
  } else {
    return res.redirect('/admin/login');
  }
};

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

exports.allTests = async (req, res, next) => {
  checker(req, res);
  let searchKey = {};
  if (req.query.disorder != '') {
    searchKey['nameEng'] = req.query.disorder;
  }
  if (req.query.test) {
    searchKey['testEng'] = req.query.test;
  }
  if (req.query.paid) {
    searchKey['paidInput'] = req.query.paid;
  }
  let tests;
  const empty = JSON.stringify(searchKey) == JSON.stringify({});
  if (empty) {
    tests = await testModel.find();
  } else {
    tests = await testModel.find(searchKey);
  }
  const groupedTests = groupBy(tests, (tests) => tests.nameEng);
  let disorders = new Set();
  for (let i = 0; i < tests.length; i++) {
    disorders.add(tests[i].nameEng);
  }
  disorders = Array.from(disorders);

  const final = [];
  for (let i = 0; i < disorders.length; i++) {
    const disorderName = disorders[i];
    const relatedTests = [];
    const testMap = groupedTests.get(disorderName);
    for (let i = 0; i < testMap.length; i++) {
      relatedTests.push(testMap[i]);
    }
    final.push({
      disorderName,
      relatedTests,
    });
  }
  res.render('admin__test', { tests: final });
};

exports.singleTest = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  console.log(id);
  const test = await testModel.findOne({ _id: id });
  console.log(test);
  res.render('singleTest', { test });
};

exports.updateTest = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  const test = await testModel.findOne({ _id: id });
  res.render('updateTest', { test });
};

exports.postUpdateTest = async (req, res) => {
  checker(req, res);
  const id = req.body.id;
  const Questions = JSON.parse(req.body.questions);
  await testModel.update(
    { _id: id },
    {
      $set: {
        testEng: req.body.testEng,
        testBan: req.body.testBan,
        nameEng: req.body.nameEng,
        nameBan: req.body.nameBan,
        age: req.body.age,
        paidInput: req.body.paidInput,
        payAmount: req.body.payAmount,
        questions: Questions,
      },
    }
  );
};

exports.createTest = async (req, res, next) => {
  checker(req, res);
  const {
    testEng,
    testBan,
    nameEng,
    nameBan,
    age,
    paidInput,
    payAmount,
  } = req.body;
  const questions = JSON.parse(req.body.questions);
  const test = {
    testEng,
    testBan,
    nameEng,
    nameBan,
    age,
    paidInput,
    payAmount,
    questions,
  };
  console.log(req.body);
  const { validateTestData } = require('../validations/test');
  const { error } = validateTestData(test);
  if (error) {
    res.send({
      status: false,
      msg: error.details[0].message,
    });
  }
  const newTest = new testModel(test);
  await newTest.save();
  console.log('test saved');
  res.send({
    status: true,
    msg: 'okay',
  });
};

exports.login = (req, res, next) => res.render('adminLogin');
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })(req, res, next);
};

exports.contactUs = async (req, res, next) => {
  checker(req, res);
  const page = +req.query.page || 1;
  const data = await contactUsModel
    .find()
    .limit(LIMIT)
    .skip(LIMIT * (page - 1))
    .sort({ _id: -1 });
  const totalItems = await contactUsModel.find().countDocuments();
  return res.render('adminContactUs', {
    data,
    ...pagination(page, LIMIT, totalItems, '/admin/contactUs?page='),
  });
};

exports.adminGetResearch = async (req, res) => {
  checker(req, res);
  const page = +req.query.page || 1;
  const search = req.query.search;
  let searchKey = { isVerified: false };
  let baseUrl = req.baseUrl;
  if (search) {
    baseUrl += `?search=${search}&page=`;
    const searchOption = {
      $regex: search,
      $options: 'i',
    };
    searchKey = {
      $or: [
        { title: searchOption },
        { BriefDesciption: searchOption },
        { conflictOfInterest: searchOption },
        { financialSupport: searchOption },
        { Acknowlegement: searchOption },
        { references: searchOption },
        { authors: searchOption },
        { isVerified: false },
      ],
    };
  } else baseUrl += `?page=`;

  const data = await ResearchModel.find(searchKey)
    .limit(LIMIT)
    .skip(LIMIT * (page - 1));
  const totalItems = await ResearchModel.find(searchKey).countDocuments();
  return res.render('adminResearch', {
    data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

exports.getResearch = async (req, res) => {
  checker(req, res);
  const data = await ResearchModel.findById(req.params.id);
  res.render('adminSingleResearch', { data });
};

exports.approveResearch = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  ResearchModel.updateOne(
    { _id: id },
    { $set: { isVerified: true } },
    (err, docs) => {
      res.redirect('/admin/get_research');
    }
  );
};

exports.disapproveResearch = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  ResearchModel.updateOne(
    { _id: id },
    { $set: { isVerified: false } },
    (err, docs) => {
      res.redirect('/admin/get_research');
    }
  );
};

exports.getInnovations = async (req, res) => {
  checker(req, res);
  const page = +req.query.page || 1;
  const search = req.query.search;
  let searchKey = { isVerified: false };
  let baseUrl = req.baseUrl;
  if (search) {
    baseUrl += `?search=${search}&page=`;
    const searchOption = {
      $regex: search,
      $options: 'i',
    };
    searchKey = {
      $or: [
        { title: searchOption },
        { BriefDesciption: searchOption },
        { conflictOfInterest: searchOption },
        { financialSupport: searchOption },
        { Acknowlegement: searchOption },
        { references: searchOption },
        { authors: searchOption },
        { isVerified: false },
      ],
    };
  } else baseUrl += `?page=`;

  const data = await InnovationModel.find(searchKey)
    .limit(LIMIT)
    .skip(LIMIT * (page - 1));
  const totalItems = await InnovationModel.find(searchKey).countDocuments();
  return res.render('adminInnovations', {
    data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

exports.singleInnoavtion = async (req, res) => {
  checker(req, res);
  const data = await InnovationModel.findById(req.params.id);
  res.render('adminSingleInnovation', { data });
};

exports.approveInnovation = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  InnovationModel.updateOne(
    { _id: id },
    { $set: { isVerified: true } },
    (err, docs) => {
      res.redirect('/admin/get_innovation');
    }
  );
};

exports.disapproveInnovation = async (req, res) => {
  checker(req, res);
  const id = req.params.id;
  InnovationModel.updateOne(
    { _id: id },
    { $set: { isVerified: false } },
    (err, docs) => {
      res.redirect('/admin/get_innovation');
    }
  );
};

const APM = (data) => (data === 'AM' ? 1 : 0);
const revAPM = (data) => (data ? 'AM' : 'PM');
const makeNumberLengthTwo = (data) => {
  let x = data.toString();
  return x.length === 2 ? x : `0${x}`;
};

const createTimeString = (frm, two) => {
  checker(req, res);
  return `${makeNumberLengthTwo(frm.from)}:00 ${revAPM(
    frm.APM
  )} - ${makeNumberLengthTwo(two.to)}:00 ${revAPM(two.APM)}`;
};

const getScheduleArray = (visitingTime) => {
  checker(req, res);
  const schedules = [];
  for (let i = 0; i < visitingTime.length; i++) {
    let frm = visitingTime[i].from;
    let two = visitingTime[i].to;
    let fromStart = parseInt(frm.split(':')[0]);
    let toEnd = parseInt(two.split(':')[0]);
    let fromAPM = APM(frm.split(' ')[1]);
    let toAPM = APM(two.split(' ')[1]);
    if (fromAPM === toAPM) {
      if (fromStart > toEnd) {
        return res.status(400).json({ success: false });
      }
    }
    while (fromStart !== toEnd || fromAPM !== toAPM) {
      schedules.push({ from: fromStart, APM: fromAPM });
      fromStart++;
      if (fromStart > 12) fromStart %= 12;
      if (fromStart === 12) fromAPM ^= 1;
      schedules.push({ to: fromStart, APM: fromAPM });
    }
  }
  const schedule = [];
  for (let i = 0; i < schedules.length; i += 2) {
    schedule.push(createTimeString(schedules[i], schedules[i + 1]));
  }
  return schedule;
};

exports.addDoctor = async (req, res, next) => {
  checker(req, res);
  const { error } = addDoctorValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { visitingTime } = req.body;
  const schedules = getScheduleArray(visitingTime);
  const doc = new addDoctorModel({
    ...req.body,
    visitingTime: schedules,
  });
  await doc.save();
  return res.json({ success: true, doc });
};

module.exports.postAddDoctor = async (req, res) => {
  checker(req, res);
  const {
    name,
    gender,
    institute,
    expertise,
    designation,
    aboutYourself,
    email,
    speciality,
    dob,
    fee,
  } = req.body;
  const education = JSON.parse(req.body.education);
  const services = JSON.parse(req.body.services);
  const workExperience = JSON.parse(req.body.workExperience);
  const visitingHour = JSON.parse(req.body.visitingHour);

  console.log(req.body);
};

module.exports.replyEmail = (req, res) => {
  checker(req, res);
  const reply = req.body.reply;
  const emailID = req.body.emailID;
  const id = req.body.id;
  // sendReply(emailID, reply)
  contactUsModel.updateOne(
    { _id: id },
    { $set: { isReplied: true } },
    (err, docs) => {
      req.flash('successMessage', 'ok');
      res.redirect('back');
    }
  );
};

function sendReply(emailID, reply) {
  var Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'safwan.du16@gmail.com',
      pass: '',
    },
  });

  var mailOptions;
  let sender = "'/'";
  mailOptions = {
    from: sender,
    to: 'safwan.du16@gmail.com',
    subject: 'Reply from TRIN',
    html: reply,
  };

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent');
    }
  });
}
