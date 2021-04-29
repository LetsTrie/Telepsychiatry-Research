const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');
const { ResearchModel } = require('../models/researches');
const InnovationModel = require('../models/innovations');
const { addDoctorModel } = require('../models/admin_addDoctor');
const { addDoctorValidation } = require('../validations/admin_addDoctor');
const passport = require('passport');
const { makeSmallParagraphFromHTML } = require('./utils');
const { testModel } = require('../models/test');
const admin = require('../config/credentials').adminCredentials;
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { Feedback } = require('../models/feedback.js');
const { sendGrid } = require('../config/sendMail');
const { eUserModel } = require('../models/expertUser');
const { wsComment } = require('../models/workshopComment.js');
const { trainingModel } = require('../models/training')

const LIMIT = 9;

exports.postTestVersion = async (req, res, next) => {
  const { id } = req.body;
  const qItem = JSON.parse(req.body.qItem);
  const newLanguage = JSON.parse(req.body.languages)[0];
  const test = await testModel.find({ _id: id });

  let QuestionSet = test[0].questionSet;
  QuestionSet.push(qItem);
  let languages = test[0].language;
  languages.push(newLanguage);

  await testModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        questionSet: QuestionSet,
        language: languages,
      },
    }
  );
};

const { createDirectory, createFile } = require('../config/file');
const { getDate } = require('../config/dateTime');

exports.getBackup = async (req, res, next) => {
  const getDBName = process.env.mongoURI.split('/')[3].split('?')[0];
  if (getDBName !== 'trin') {
    return res.status(403).json({
      success: false,
      message: 'ACCESS_DENIED',
    });
  }
  const expertUserData = await eUserModel.find();
  const FolderName = '/Backup/' + getDate();
  await createDirectory(FolderName);
  await createFile(
    FolderName + '/expertUsers.json',
    JSON.stringify(expertUserData)
  );
  return res.json(expertUserData);
};

exports.getAdminNewResearch = async (req, res, next) => {
  return res.render('addResearchFromAdmin', { user: req.user });
};

exports.getAdminResearch = async (req, res, next) => {
  return res.render('singleResearchFromAdmin', { user: req.user });
};

exports.getAdminResearches = async (req, res, next) => {
  return res.render('researchsFromAdmin', { user: req.user });
};

exports.postTestVersion = async (req, res, next) => {
  const { id } = req.body;
  const qItem = JSON.parse(req.body.qItem);
  const newLanguage = JSON.parse(req.body.languages)[0];
  const test = await testModel.find({ _id: id });

  let QuestionSet = test[0].questionSet;
  QuestionSet.push(qItem);
  let languages = test[0].language;
  languages.push(newLanguage);

  await testModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        questionSet: QuestionSet,
        language: languages,
      },
    }
  );

  res.send({
    status: true,
    id: id,
  });
};

exports.postUpdateTest = async (req, res) => {
  const { id, qLang } = req.body;
  let QuestionSet = JSON.parse(req.body.questionSet)[0];
  const test = await testModel.findById(id);
  for (let i = 0; i < test.questionSet.length; i++) {
    if (test.questionSet[i].language == qLang) {
      test.questionSet.splice(i, 1);
    }
  }
  test.questionSet.push({
    Questions: QuestionSet.Questions,
    language: QuestionSet.language,
  });
  await testModel.update(
    { _id: id },
    {
      $set: {
        testEng: req.body.testEng,
        testBan: req.body.testBan,
        disorderNameEng: trnsfrm(req.body.disorderNameEng),
        disorderNameBan: req.body.disorderNameBan,
        age: req.body.age,
        isPaid: req.body.isPaid,
        payAmount: req.body.payAmount,
        questionSet: test.questionSet,
      },
    }
  );

  res.send({
    status: true,
    msg: 'okay',
  });
};

// ############## OKAY ####################

/*
  @method : GET
  @route  : /admin/
  @auth   : Private [Admin]
  @desc   : Admin Dashboard
*/

exports.getDashboard = (req, res, next) =>
  res.render('admin_dashboard', {
    user: req.user,
  });

/*
  @method : GET
  @route  : /admin/login
  @auth   : Public
  @desc   : Login
*/

exports.getLogin = (req, res, next) =>
  res.render('adminLogin', {
    user: req.user,
  });

/*
  @method : POST
  @route  : /admin/login
  @auth   : Public
  @desc   : Login
*/

exports.postLogin = (req, res, next) => {
  if (req.body.email == admin.email && req.body.password === admin.password) {
    passport.authenticate('local', {
      successRedirect: '/admin/',
      failureRedirect: '/admin/login',
      failureFlash: true,
    })(req, res, next);
  } else {
    return res.json({
      gotError: true,
      message: 'Incorrect Email or Password',
    });
  }
};

/*
  @method : POST
  @route  : /admin/test/new
  @auth   : Private [Admin]
  @desc   : Add Test
*/

exports.createTest = async (req, res, next) => {
  let {
    testEng,
    testBan,
    disorderNameEng,
    disorderNameBan,
    age,
    isPaid,
    payAmount,
  } = req.body;
  const language = JSON.parse(req.body.languages);
  const questionSet = JSON.parse(req.body.questionSet);
  const test = {
    testEng,
    testBan,
    disorderNameEng: trnsfrm(disorderNameEng),
    disorderNameBan,
    age,
    isPaid,
    payAmount,
    language,
    questionSet,
  };
  const { validateTestData } = require('../validations/test');
  const { error } = validateTestData(test);
  if (error) return res.send({ status: false, msg: error.details[0].message });
  const newTest = new testModel(test);
  await newTest.save();
  return res.send({
    status: true,
    msg: 'okay',
    id: newTest._id,
    lang: test.language[0],
  });
};

/*
  @method : GET
  @route  : /admin/tests
  @auth   : Private [Admin]
  @desc   : Show All Disorders with distinct Test name
*/

exports.getAllTests = async (req, res, next) => {
  let searchKey = {};
  const { disorder, test, paid } = req.query;
  if (!nullChk(disorder)) searchKey['disorderNameEng'] = disorder;
  if (!nullChk(test)) searchKey['testEng'] = test;
  if (!nullChk(paid)) searchKey['isPaid'] = paid;

  let tests = await testModel.find(searchKey);

  let disorders = new Set();
  for (let i = 0; i < tests.length; i++)
    disorders.add(tests[i].disorderNameEng);
  disorders = Array.from(disorders);

  const groupedTests = groupBy(tests, (tests) => tests.disorderNameEng);

  let final = [];
  for (let i = 0; i < disorders.length; i++) {
    let disorderName = disorders[i];
    let relatedTests = [];
    let testMap = groupedTests.get(disorderName.toLowerCase());
    for (let j = 0; j < testMap.length; j++) {
      const langLen = testMap[j].language.length;
      let language = langLen == 1 ? testMap[j].language[0] : 'English';
      relatedTests.push({ test: testMap[j], language });
    }
    final.push({ disorderName, relatedTests });
  }

  // ########### Search Disorder (All names) ###########
  let AllTestForSearch = await testModel.find();
  let fs_disorders = new Set();
  for (let i = 0; i < AllTestForSearch.length; i++)
    fs_disorders.add(
      trnsfrm(AllTestForSearch[i].disorderNameEng.toLowerCase())
    );
  fs_disorders = Array.from(fs_disorders);
  // ###################################################

  return res.render('admin__test', {
    tests: final,
    searchDisorder: fs_disorders,
    user: req.user,
  });
};

/*
  @method : GET
  @route  : /admin/test/single/:id?lang=
  @auth   : Private [Admin]
  @desc   : Show a single test
*/

exports.getSingleTest = async (req, res) => {
  let testData = await testModel.findById(req.params.id);
  let { lang } = req.query;
  if (nullChk(lang)) {
    const langLen = testData.language.length;
    lang = langLen === 1 ? testData.language[0] : 'English';
  }
  const test = await getTestData(testData, lang);
  console.log(test);
  res.render('singleTest', { test, lang, user: req.user });
};

/*
  @method : GET
  @route  : /admin/test/update/:id?lang=
  @auth   : Private [Admin]
  @desc   : Update a test of a language
*/

exports.updateTest = async (req, res) => {
  let test = await testModel.findById(req.params.id);
  let { lang } = req.query;
  if (nullChk(lang)) {
    const langLen = test.language.length;
    lang = langLen === 1 ? test.language[0] : 'English';
  }
  const questionData = await getTestData(test, lang);
  res.render('updateTest', { test, questionData, lang, user: req.user });
};

/*
  @method : POST
  @route  : /admin/findTestbyDisorder
  @auth   : Private [Admin]
  @desc   : Find Test by Disorder
*/

exports.findTestbyDisorder = async (req, res) => {
  const { value } = req.body;
  const tests = await testModel.find({ disorderNameEng: value });
  return res.json({
    test: tests.map((x) => x.testEng),
  });
};

/*
  @method : GET
  @route  : /admin/test/version/:id?alt=
  @auth   : Private [Admin]
  @desc   : Insert new (language) version of a test...
*/

exports.addTestVersion = async (req, res, next) => {
  let { alt } = req.query;
  if (alt === 'English') alt = 'Bengali';
  else alt = 'English';
  const test = await testModel.findById(req.params.id);
  return res.render('addTestVersion', { test, version: alt, user: req.user });
};

async function getTestData(test, lang) {
  let data = {};
  data['_id'] = test._id;
  data['testName'] = lang === 'English' ? test.testEng : test.testBan;
  data['disorderName'] =
    lang === 'English' ? test.disorderNameEng : test.disorderNameBan;
  data['ageRange'] = test.age;
  data['paidInput'] = test.isPaid;
  data['payAmount'] = test.payAmount;
  data['language'] = test.language;
  data['questions'] = [];

  let questions = [];
  for (let i = 0; i < test.questionSet.length; i++) {
    if (test.questionSet[i].language == lang) {
      questions = test.questionSet[i].Questions;
      break;
    }
  }
  for (let i = 0; i < questions.length; i++) {
    let obj = {};
    obj['QuesName'] = questions[i].question;
    obj['QuesScale'] = questions[i].scale;
    obj['options'] = [];
    for (let j = 0; j < questions[i].Options.length; j++) {
      obj['options'].push({
        optionName: questions[i].Options[j].option,
        optionScale: questions[i].Options[j].scale,
      });
    }
    data['questions'].push(obj);
  }
  return data;
}

// ################## Utils #######################

function trnsfrm(x) {
  return x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();
}

function nullChk(data) {
  return data === undefined || data === null || data === '';
}

function checker(req, res) {
  if (req.user) {
    const logged = JSON.stringify(admin) == JSON.stringify(req.user);
    if (!logged) {
      return res.redirect('/admin/login');
    }
  } else {
    return res.redirect('/admin/login');
  }
}

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item).toLowerCase();
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

// ####################### Extra Part #######################
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
    user: req.user,
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
    user: req.user,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

exports.getResearch = async (req, res) => {
  checker(req, res);
  const data = await ResearchModel.findById(req.params.id);
  res.render('adminSingleResearch', { data, user: req.user });
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
    user: req.user,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

exports.singleInnoavtion = async (req, res) => {
  checker(req, res);
  const data = await InnovationModel.findById(req.params.id);
  res.render('adminSingleInnovation', { data, user: req.user });
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

module.exports.replyEmail = async (req, res) => {
  checker(req, res);
  const reply = req.body.reply;
  const emailID = req.body.emailID;
  const id = req.body.id;
  const data = {
    address: emailID,
    subject: 'TRIN - Contact Us',
    body: reply,
  };
  console.log(data);
  await sendGrid(data);
  contactUsModel.updateOne(
    { _id: id },
    { $set: { isReplied: true } },
    (err, docs) => {
      req.flash('successMessage', 'ok');
      res.redirect('back');
    }
  );
};

// Research Module
exports.getAllResearches = async (req, res) => {
  const { stage } = req.query;
  const researches = await ResearchModel.find({ researchStage: stage });
  console.log(researches);
  if (stage == 'ongoing') {
    res.render('ongoingResearches', { researches, search: null });
  } else {
    res.render('completeResearches', { researches, search: null });
  }
};
exports.researchFile = async (req, res) => {
  console.log('file saved');
  res.redirect(`/admin/research/${req.body.id}`);
};

exports.adminUpdateResearchFile = async (req, res) => {
  console.log('Research file updated');
  const { id, filename, prevFilename } = req.body;
  // console.log(id, filename, prevFilename);
  try {
    let research = await ResearchModel.findOne({ _id: id });
    research.file = filename;
    await research.save();

    await deleteFile('research', prevFilename);
    res.redirect(`/admin/research/${id}`);
    return;
  } catch (err) {
    req.flash('errorMessage', err.message);
    res.redirect(`/admin/research/${id}`);
    return;
  }
};

exports.adminUpdateInnovationFile = async (req, res) => {
  console.log('Innovation file updated');
  const { id, filename, prevFilename } = req.body;
  // console.log(id, filename, prevFilename);
  try {
    let innovation = await InnovationModel.findOne({ _id: id });
    innovation.file = filename;
    await innovation.save();

    await deleteFile('innovation', prevFilename);
    res.redirect(`/admin/innovation/${id}`);
    return;
  } catch (err) {
    req.flash('errorMessage', err.message);
    res.redirect(`/admin/innovation/${id}`);
    return;
  }
};

// ADMIN SUBMIT RESEARCH (GET)
// OKAY
exports.getAdminNewResearch = async (req, res, next) => {
  return res.render('addResearchFromAdmin', { user: req.user });
};

// addmin add new special service
const { ssModel } = require('../models/specialService.js');
exports.getSS = async (req, res) => {
  const data = await ssModel.find();
  return res.render('specialServicesForAdmin', {
    data,
    user: req.user,
  });
};

exports.singleSS = async (req, res) => {
  const data = await ssModel.findOne({ _id: req.params.id });
  let doctorInfo = [];
  for (let i = 0; i < data.doctorIDs.length; i++) {
    const doc = await eUserModel.findOne({ _id: data.doctorIDs[i] });
    if (doc == null) continue;
    doctorInfo.push({
      image: doc.propicURL,
      designation: doc.designation,
    });
  }

  console.log('data : ', data);
  console.log('doctorInfo : ', doctorInfo);

  const parts = await ssBookModel.find({ ss_id: req.params.id });
  const feedbacks = await Feedback.find({
    service_id: req.params.id,
  });

  return res.render('singleSpecialServiceFromAdmin', {
    serviceId: req.params.id,
    user: req.user,
    data,
    doctorInfo,
    parts,
    feedbacks,
  });
};

exports.getAdminNewSpecialService = async (req, res, next) => {
  return res.render('addSpecialService', { user: req.user });
};

exports.getExperts = async (req, res) => {
  const allDocs = await eUserModel.find();
  let doctors = [];
  let docIDs = [];
  for (let i = 0; i < allDocs.length; i++) {
    doctors.push(allDocs[i].name);
    docIDs.push(allDocs[i]._id);
  }
  res.send({
    doctors,
    docIDs,
  });
};

exports.postAdminNewSS = async (req, res) => {
  console.log(req.body);
  const { title, subTitle, description, details, fee, image, Max } = req.body;
  const schedule = JSON.parse(req.body.schedule);
  const doctorIDs = JSON.parse(req.body.doctorIDs);
  const doctorNames = JSON.parse(req.body.doctorNames);
  const videos = JSON.parse(req.body.videos);

  const capacity = {
    Max,
  };

  const obj = {
    title,
    subTitle,
    description,
    details,
    fee,
    schedule,
    capacity,
    image,
    videos,
    doctorIDs,
    doctorNames,
  };
  const newSS = new ssModel(obj);
  console.log(newSS);
  await newSS.save();
  res.send({
    status: true,
    msg: 'Special service has been added',
  });

  // const days = [
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   'Saturday',
  //   'Sunday',
  // ];
  // const resetTime = 7 * 24 * 1000 * 36000;
  // setInterval(async () => {
  //   const day = new Date().getDay();
  //   if (obj.schedule.weekDay == days[day - 1]) {
  //     console.log('updates now');
  //     const this_SS = await ssModel.findOne({ _id: newSS._id });
  //     const newCap = {
  //       alottedPatients: 0,
  //       Max: this_SS.capacity.Max,
  //     };
  //     await ssModel.findOneAndUpdate(
  //       { _id: newSS._id },
  //       {
  //         $set: {
  //           capacity: newCap,
  //         },
  //       }
  //     );
  //   }
  // }, resetTime);
};

exports.ssFile = async (req, res) => {
  console.log('special service file saved');
  res.redirect('back');
};

const { ssBookModel } = require('../models/ss_book.js');
exports.getSSBookRequests = async (req, res) => {
  const data = await ssBookModel.find({ isConfirmed: false });
  return res.render('ssBookRequestsForAdmin', {
    data,
    user: req.user,
  });
};
const getResetTime = (day) => {
  console.log(day);
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const dayNo = days.indexOf(day) + 1;
  var resetDate = new Date();
  resetDate.setDate(
    resetDate.getDate() + ((7 - resetDate.getDay()) % 7) + dayNo
  );
  resetDate.setHours(12);
  resetDate.setHours(resetDate.getHours() + 6);
  resetDate.setMinutes(0);
  console.log(resetDate);
  const dif = Math.round((resetDate - new Date()) / 1000);
  return dif;
};
exports.approveSSBookRequest = async (req, res) => {
  const { ssConfirmMail } = require('../config/sendMail.js');
  const ss = await ssModel.findOne({ _id: req.params.ss_id });
  const alpat = ss.capacity.alottedPatients + 1;
  const ssBook = await ssBookModel.findOne({ _id: req.params.apt_id });

  let newCap = {
    alottedPatients: alpat,
    Max: ss.capacity.Max,
  };
  console.log(newCap);
  await ssModel.findOneAndUpdate(
    { _id: req.params.ss_id },
    {
      $set: {
        capacity: newCap,
      },
    }
  );
  await ssBookModel.findOneAndUpdate(
    { _id: req.params.apt_id },
    {
      $set: {
        isConfirmed: true,
      },
    }
  );
  const { ss_name, bookingType, email } = ssBook;
  let body;
  if (bookingType == 'Online') {
    body = `This is to confirm that your request for the special service <strong>${ss_name}</strong> has been confirmed. The meeting will be an online one and please join <a href=http://monerdaktar.com/${ss._id}>this link</a> to participate. <br/> Thanks for choosing us.`;
  } else {
    body = `This is to confirm that your request for the special service <strong>${ss_name}</strong> has been confirmed. The meeting will be an Face to Face one, so please drop by at our office address at the due time. <br/> Thanks for choosing us.`;
  }
  console.log(email);
  const data = {
    address: email,
    subject: 'Special Service booking confirmation',
    body,
  };

  await sendGrid(data);

  return res.redirect('back');
};

exports.deleteBook = async (req, res) => {
  const { pid, sid } = req.params;
  console.log(pid, sid);
  await ssBookModel.findByIdAndDelete(pid);
  const ss = await ssModel.findById(sid);
  console.log(ss);
  const alpat = ss.capacity.alottedPatients - 1;
  const newCap = {
    alottedPatients: alpat,
    Max: ss.capacity.Max,
  };
  await ssModel.findByIdAndUpdate(sid, {
    $set: {
      capacity: newCap,
    },
  });
  res.redirect('back');
};

// ADMIN SUBMIT RESEARCH (POST)
// OKAY
const { validateResearchData } = require('../validations/researches');
exports.postResearches = async (req, res) => {
  if (!req.user) return res.send('User not found');
  const { error } = validateResearchData(req.body);
  console.log(error);
  if (error) return res.send({ status: false, msg: 'error' });
  const newResearch = new ResearchModel({
    ...req.body,
    description: makeSmallParagraphFromHTML([req.body], 'description')[0]
      .description,
    authorID: req.user._id,
    isVerified: true,
  });
  await newResearch.save();
  console.log(newResearch);
  console.log('Bingo');
  return res.send({ status: true, msg: newResearch._id });
};

// ADMIN GET SINGLE RESEARCH
// OKAY
exports.getAdminResearch = async (req, res, next) => {
  const data = await ResearchModel.findById(req.params.id);
  return res.render('singleResearchFromAdmin', {
    data,
    user: req.user,
  });
};

// ADMIN SHOW RESEARCH ( VERIFIED / UNVERIFIED)
// OKAY
exports.getAdminResearches = async (req, res, next) => {
  const { verified } = req.query;
  let isVerified = verified === 'false' ? false : true;
  const data = await ResearchModel.find({ isVerified });
  return res.render('researchsFromAdmin', {
    data,
    user: req.user,
  });
};

exports.getUnverifiedResearches = async (req, res, next) => {
  const data = await ResearchModel.find({ isVerified: false });
  return res.render('unverifiedResearchesAdmin', {
    data,
    user: req.user,
  });
};

exports.getAdminUpdateResearch = async (req, res, next) => {
  const data = await ResearchModel.findOne({ _id: req.params.id });
  return res.render('updateResearchFromAdmin', {
    data,
    user: req.user,
  });
};

exports.postAdminUpdateResearch = async (req, res) => {
  const {
    id,
    title,
    description,
    name,
    designation,
    email,
    phone,
    collaboration,
    collabScope,
    financialSupport,
    newsAndPub,
    researchStage,
    file,
    prevFile,
  } = req.body;

  await ResearchModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        description: description,
        name: name,
        designation: designation,
        email: email,
        phone: phone,
        collaboration: collaboration,
        collabScope: collabScope,
        financialSupport: financialSupport,
        newsAndPub: newsAndPub,
        researchStage: researchStage,
      },
    }
  );

  let newFileUploaded = nullChk(file) ? false : true;
  // file name will be updated after file uploading done and prev file deletion done.
  // File uploading and deletion will be done in route named "/admin/research/update/file"

  res.send({
    status: true,
    newFileUploaded: newFileUploaded,
    msg: 'Research updated',
  });
};

exports.approveResearch = async (req, res) => {
  await ResearchModel.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isVerified: true } }
  );
  res.redirect('/admin/researches');
};

exports.disapproveResearch = async (req, res) => {
  // checker(req, res);
  const id = req.params.id;
  await ResearchModel.findByIdAndDelete(id);
  res.redirect('/admin/researches');
};

// Innovations Module

exports.innovationFile = async (req, res) => {
  console.log('innovations file saved');
  res.redirect(`/admin/innovation/${req.body.id}`);
};

// ADMIN POST NEW INNOVATION
// OKAY
const { validateInnovationData } = require('../validations/innovations');
exports.postInnovation = async (req, res) => {
  console.log('I am in controller');
  const { error } = validateInnovationData(req.body);
  console.log('Checking Joi Error: ', error);
  if (error) return res.send({ status: false, msg: 'error' });
  const newInn = new InnovationModel({
    ...req.body,
    description: makeSmallParagraphFromHTML([req.body], 'description')[0]
      .description,
    authorID: req.user._id,
    isVerified: true,
  });
  console.log('New Object: ', newInn);
  await newInn.save();
  console.log('MongoObject Saved: ', newInn);
  return res.send({ status: true, msg: newInn._id });
};

// ADMIN GET INNOVATION
// OKAY
exports.getAdminInnovation = async (req, res, next) => {
  const data = await InnovationModel.findOne({ _id: req.params.id });
  return res.render('singleInnovationFromAdmin', {
    data,
    user: req.user,
  });
};

exports.getUnverifiedInnoations = async (req, res, next) => {
  const data = await InnovationModel.find({ isVerified: false });
  return res.render('unverifiedInnovationsAdmin', {
    data,
    user: req.user,
  });
};

exports.getAdminInnovations = async (req, res, next) => {
  const { verified } = req.query;
  let isVerified = verified === 'false' ? false : true;
  const data = await InnovationModel.find({ isVerified });
  return res.render('innovationsFromAdmin', {
    data,
    user: req.user,
  });
};

exports.getAdminUpdateInnovation = async (req, res, next) => {
  const data = await InnovationModel.findOne({ _id: req.params.id });
  return res.render('updateInnovationFromAdmin', {
    data,
    user: req.user,
  });
};

exports.postAdminUpdateInnovation = async (req, res) => {
  const {
    id,
    title,
    description,
    name,
    designation,
    email,
    phone,
    collaboration,
    collabScope,
    financialSupport,
    newsAndPub,
    innovationStage,
    link,
    file,
    prevFile,
  } = req.body;

  await InnovationModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        description: description,
        name: name,
        designation: designation,
        email: email,
        phone: phone,
        collaboration: collaboration,
        collabScope: collabScope,
        financialSupport: financialSupport,
        newsAndPub: newsAndPub,
        innovationStage: innovationStage,
        link: link,
      },
    }
  );
  let newFileUploaded = nullChk(file) ? false : true;
  // file name will be updated after file uploading done and prev file deletion done.
  // File uploading and deletion will be done in route named "/admin/innovation/update/file"

  res.send({
    status: true,
    newFileUploaded: newFileUploaded,
    msg: 'Innovation updated',
  });
};

exports.approveInnovation = async (req, res) => {
  // checker(req, res);
  const id = req.params.id;
  await InnovationModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isVerified: true,
      },
    }
  );
  res.redirect('/admin/innovations');
};

exports.disapproveInnovation = async (req, res) => {
  // checker(req, res);
  const id = req.params.id;
  console.log(id);
  await InnovationModel.findByIdAndDelete(id);
  res.redirect('/admin/innovations');
};

// Events
const { workshopModel } = require('../models/workshop.js');
const { workshopReg } = require('../models/workshopRegistration.js');
const { readFileSync } = require('fs');
exports.getWorkshop = async (req, res, next) => {
  let { type, search } = req.query;
  let data;
  if (type) {
    if (type == 'current') {
      data = await workshopModel.find({
        start: { $lte: new Date() },
        end: { $gte: new Date() },
      });
      res.render('allWorkshopFromAdmin', {
        data,
        user: req.user,
      });
    } else if (type == 'past') {
      data = await workshopModel.find({
        end: { $lte: new Date() },
      });
      res.render('allWorkshopFromAdmin', {
        data,
        user: req.user,
      });
    } else if (type == 'upcoming') {
      data = await workshopModel.find({
        start: { $gte: new Date() },
      });
      res.render('allWorkshopFromAdmin', {
        data,
        user: req.user,
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
    return res.render('allWorkshopFromAdmin', {
      data,
      user: req.user,
    });
  }
  data = await workshopModel.find().sort({ _id: -1 });
  res.render('allWorkshopFromAdmin', { data, user: req.user });
};

exports.singleWorkshop = async (req, res) => {
  const comments = await wsComment.find({ eventID: req.params.id, eventType: 'workshop' });
  const data = await workshopModel.findOne({ _id: req.params.id });
  const parts = await workshopReg.find({ event_id: req.params.id });
  const eUser = [];
  for (let i = 0; i < data.doctors.length; i++) {
    const doc = await eUserModel.findOne({ name: data.doctors[i] });
    if (doc != null) eUser.push(doc);
  }

  res.render('singleWorkshopFromAdmin', {
    user: req.user,
    data,
    comments,
    ourExperts: eUser,
    parts,
  });
};

exports.postWorkshop = async (req, res) => {
  const { title, description, about, location, image } = req.body;
  const schedule = JSON.parse(req.body.schedule);
  const sdate = schedule.startDate.split('/');
  const stime = schedule.startTime.split(':');
  let x;
  let y = ('0' + parseInt(stime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.startTime[6] == 'P' && stime != '12') {
    x = ('0' + (parseInt(stime[0]) + 12)).slice(-2);
  } else {
    x = ('0' + (parseInt(stime[0]) % 12)).slice(-2);
  }

  let start = sdate[2] + '-' + sdate[0] + '-' + sdate[1] + 'T' + x + ':' + y;
  console.log(start);
  start = new Date(start);
  start.setHours(start.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(start);

  const edate = schedule.endDate.split('/');
  const etime = schedule.endTime.split(':');
  let a;
  let b = ('0' + parseInt(etime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.endTime[6] == 'P' && etime != '12') {
    a = ('0' + (parseInt(etime[0]) + 12)).slice(-2);
  } else {
    a = ('0' + (parseInt(etime[0]) % 12)).slice(-2);
  }

  let end = edate[2] + '-' + edate[0] + '-' + edate[1] + 'T' + a + ':' + b;
  console.log(end);
  end = new Date(end);
  end.setHours(end.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(end);

  obj = {
    title,
    description,
    about,
    videos: JSON.parse(req.body.videos),
    doctors: JSON.parse(req.body.doctors),
    location,
    schedule,
    start,
    end,
    image,
  };
  const newWorkshop = new workshopModel(obj);
  console.log(newWorkshop);
  await newWorkshop.save();
  res.send({
    status: true,
    msg: 'Workshop created',
  });
};

exports.workshopFile = async (req, res) => {
  console.log('Workshop file added');
  res.redirect('/admin/workshop');
};

exports.updateWorkshopFile = async (req, res) => {
  console.log('Workshop file updated');
  const { id, filename, prevFilename } = req.body;
  // console.log(id, filename, prevFilename);
  try {
    let workshop = await workshopModel.findOne({ _id: id });
    workshop.image = filename;
    await workshop.save();

    await deleteFile('workshop', prevFilename);
    res.redirect(`/admin/workshop/${id}`);
    return;
  } catch (err) {
    req.flash('errorMessage', err.message);
    res.redirect(`/admin/workshop/${id}`);
    return;
  }
};

exports.updateSSFile = async (req, res) => {
  console.log('Special Service file updated');
  const { id, filename, prevFilename } = req.body;
  // console.log(id, filename, prevFilename);
  try {
    let specialService = await ssModel.findOne({ _id: id });
    specialService.image = filename;
    await specialService.save();

    await deleteFile('specialService', prevFilename);
    res.redirect(`/admin/special_service/${id}`);
    return;
  } catch (err) {
    req.flash('errorMessage', err.message);
    res.redirect(`/admin/special_service/${id}`);
    return;
  }
};

async function deleteFile(directory, fileName) {
  if (nullChk(fileName)) return;

  const filePath = path.join(process.cwd(), '/public', directory, fileName);
  console.log('filepath of the file that needs to be deleted: ', filePath);

  try {
    await fsPromises.unlink(filePath);
    console.log(`successfully deleted the file : ${fileName}`);
  } catch (err) {
    console.log('deleteFile err = ', { err });
    throw new Error(err.message);
  }
}

exports.getUpdateWorkshop = async (req, res) => {
  const data = await workshopModel.findOne({ _id: req.params.id });
  res.render('updateWorkshop', {
    user: req.user,
    data,
  });
};

exports.postUpdateWorkshop = async (req, res) => {
  const { id, title, description, about, location, image } = req.body;
  const schedule = JSON.parse(req.body.schedule);
  const sdate = schedule.startDate.split('/');
  const stime = schedule.startTime.split(':');
  let x;
  let y = ('0' + parseInt(stime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.startTime[6] == 'P' && stime != '12') {
    x = ('0' + (parseInt(stime[0]) + 12)).slice(-2);
  } else {
    x = ('0' + (parseInt(stime[0]) % 12)).slice(-2);
  }

  let start = sdate[2] + '-' + sdate[0] + '-' + sdate[1] + 'T' + x + ':' + y;
  console.log(start);
  start = new Date(start);
  start.setHours(start.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(start);

  const edate = schedule.endDate.split('/');
  const etime = schedule.endTime.split(':');
  let a;
  let b = ('0' + parseInt(etime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.endTime[6] == 'P' && etime != '12') {
    a = ('0' + (parseInt(etime[0]) + 12)).slice(-2);
  } else {
    a = ('0' + (parseInt(etime[0]) % 12)).slice(-2);
  }

  let end = edate[2] + '-' + edate[0] + '-' + edate[1] + 'T' + a + ':' + b;
  console.log(end);
  end = new Date(end);
  end.setHours(end.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(end);

  let newFileUploaded = nullChk(image) ? false : true;
  // image name will be updated after file uploading done and prev file deletion done.
  // File uploading and deletion will be done in route named "/admin/workshop/update/file"

  await workshopModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        description: description,
        about: about,
        videos: JSON.parse(req.body.videos),
        doctors: JSON.parse(req.body.doctors),
        location: location,
        schedule: {
          startDate: schedule.startDate,
          startTime: schedule.startTime,
          endDate: schedule.endDate,
          endTime: schedule.endTime,
        },
        start: start,
        end: end,
      },
    }
  );

  res.send({
    status: true,
    newFileUploaded: newFileUploaded,
    msg: 'Workshop updated',
  });
};

exports.addWorkshopToHomepage = async (req, res) => {
  const { id } = req.params;
  await workshopModel.findOneAndUpdate({ _id: id }, { homepageDisplay: true });
  res.redirect('back');
};

exports.removeWorkshopFromHomepage = async (req, res) => {
  const { id } = req.params;
  await workshopModel.findOneAndUpdate({ _id: id }, { homepageDisplay: false });
  res.redirect('back');
};

exports.deleteWorkshop = async (req, res) => {
  await workshopModel.findByIdAndDelete({ _id: req.params.id });
  res.redirect('/admin/workshop');
};

// Admin training sessions

exports.getTraining = async (req, res, next) => {
  let { type, search } = req.query;
  let data;
  if (type) {
    if (type == 'current') {
      data = await trainingModel.find({
        start: { $lte: new Date() },
        end: { $gte: new Date() },
      });
      res.render('allTrainingFromAdmin', {
        data,
        user: req.user,
      });
    } else if (type == 'past') {
      data = await Trainingnd({
        end: { $lte: new Date() },
      });
      res.render('allTrainingFromAdmin', {
        data,
        user: req.user,
      });
    } else if (type == 'upcoming') {
      data = await trainingModel.find({
        start: { $gte: new Date() },
      });
      res.render('allTrainingFromAdmin', {
        data,
        user: req.user,
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
    return res.render('allTrainingFromAdmin', {
      data,
      user: req.user,
    });
  }
  data = await trainingModel.find().sort({ _id: -1 });
  res.render('allTrainingFromAdmin', { data, user: req.user });
};

exports.singleTraining = async (req, res) => {
  const comments = await wsComment.find({ eventID: req.params.id, eventType: 'training' });
  const data = await trainingModel.findOne({ _id: req.params.id });
  const parts = await workshopReg.find({ event_id: req.params.id });
  const eUser = [];
  for (let i = 0; i < data.doctors.length; i++) {
    const doc = await eUserModel.findOne({ name: data.doctors[i] });
    if (doc != null) eUser.push(doc);
  }

  res.render('singleTrainingFromAdmin', {
    user: req.user,
    data,
    comments,
    ourExperts: eUser,
    parts,
  });
};

exports.postTraining = async (req, res) => {
  const { title, description, about, location, faqs, image } = req.body;
  const schedule = JSON.parse(req.body.schedule);
  const sdate = schedule.startDate.split('/');
  const stime = schedule.startTime.split(':');
  let x;
  let y = ('0' + parseInt(stime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.startTime[6] == 'P' && stime != '12') {
    x = ('0' + (parseInt(stime[0]) + 12)).slice(-2);
  } else {
    x = ('0' + (parseInt(stime[0]) % 12)).slice(-2);
  }

  let start = sdate[2] + '-' + sdate[0] + '-' + sdate[1] + 'T' + x + ':' + y;
  console.log(start);
  start = new Date(start);
  start.setHours(start.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(start);

  const edate = schedule.endDate.split('/');
  const etime = schedule.endTime.split(':');
  let a;
  let b = ('0' + parseInt(etime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.endTime[6] == 'P' && etime != '12') {
    a = ('0' + (parseInt(etime[0]) + 12)).slice(-2);
  } else {
    a = ('0' + (parseInt(etime[0]) % 12)).slice(-2);
  }

  let end = edate[2] + '-' + edate[0] + '-' + edate[1] + 'T' + a + ':' + b;
  console.log(end);
  end = new Date(end);
  end.setHours(end.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(end);

  obj = {
    title,
    description,
    about,
    videos: JSON.parse(req.body.videos),
    doctors: JSON.parse(req.body.doctors),
    location,
    schedule,
    start,
    end,
    faqs,
    image,
  };
  const newWorkshop = new trainingModel(obj);
  console.log(newWorkshop);
  await newWorkshop.save();
  res.send({
    status: true,
    _id: newWorkshop._id,
    msg: 'Training created',
  });
};

exports.trainingFile = async (req, res) => {
  const image = req.files['trainingFile'][0].filename
  const certificate = req.files['trainingCertificate'][0].filename

  const training = await trainingModel.findOne({ _id: req.body.id })
  training.image = image
  training.certificate = certificate
  await training.save()

  res.redirect('/admin/training');
};

exports.getUpdateTraining = async (req, res) => {
  const data = await trainingModel.findOne({ _id: req.params.id });
  res.render('updateTraining', {
    user: req.user,
    data,
  });
};

exports.postUpdateTraining = async (req, res) => {
  const { id, title, description, about, location, faqs, image, certificate } = req.body;
  const schedule = JSON.parse(req.body.schedule);
  const sdate = schedule.startDate.split('/');
  const stime = schedule.startTime.split(':');
  let x;
  let y = ('0' + parseInt(stime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.startTime[6] == 'P' && stime != '12') {
    x = ('0' + (parseInt(stime[0]) + 12)).slice(-2);
  } else {
    x = ('0' + (parseInt(stime[0]) % 12)).slice(-2);
  }

  let start = sdate[2] + '-' + sdate[0] + '-' + sdate[1] + 'T' + x + ':' + y;
  console.log(start);
  start = new Date(start);
  start.setHours(start.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(start);

  const edate = schedule.endDate.split('/');
  const etime = schedule.endTime.split(':');
  let a;
  let b = ('0' + parseInt(etime[1].split(' ')[0])).slice(-2); //0 prepended for formatting
  if (schedule.endTime[6] == 'P' && etime != '12') {
    a = ('0' + (parseInt(etime[0]) + 12)).slice(-2);
  } else {
    a = ('0' + (parseInt(etime[0]) % 12)).slice(-2);
  }

  let end = edate[2] + '-' + edate[0] + '-' + edate[1] + 'T' + a + ':' + b;
  console.log(end);
  end = new Date(end);
  end.setHours(end.getHours() - new Date().getTimezoneOffset() / 60);
  console.log(end);

  let newFileUploaded = false
  if (!nullChk(image) || !nullChk(certificate)) {
    newFileUploaded = true
  }
  // image name will be updated after file uploading done and prev file deletion done.
  // File uploading and deletion will be done in route named "/admin/workshop/update/file"

  await trainingModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        description: description,
        about: about,
        videos: JSON.parse(req.body.videos),
        doctors: JSON.parse(req.body.doctors),
        location: location,
        schedule: {
          startDate: schedule.startDate,
          startTime: schedule.startTime,
          endDate: schedule.endDate,
          endTime: schedule.endTime,
        },
        start: start,
        end: end,
        faqs: faqs,
      },
    }
  );

  res.send({
    status: true,
    newFileUploaded: newFileUploaded,
    msg: 'Training updated',
  });
};

exports.updateTrainingFile = async (req, res) => {
  console.log('Training file updated');
  const { id, prevFilename, prevCertificateName, trainingCertificate } = req.body;

  try {
    let training = await trainingModel.findOne({ _id: id });
    if (req.files.trainingFile) {
      training.image = req.files.trainingFile[0].filename
      await deleteFile('training', prevFilename);
    }
    if (req.files.trainingCertificate) {
      training.certificate = req.files.trainingCertificate[0].filename
      await deleteFile('training', prevCertificateName);
    }
    await training.save();

    res.redirect(`/admin/training/${id}`);
    return;
  } catch (err) {
    req.flash('errorMessage', err.message);
    res.redirect(`/admin/training/${id}`);
    return;
  }
};

exports.deleteTraining = async (req, res) => {
  await trainingModel.findByIdAndDelete({ _id: req.params.id });
  res.redirect('/admin/training');
};

// Admin special services

exports.getUpdateSingleSS = async (req, res, next) => {
  const eUser = require('../data/homepage_experts');
  console.log({ id: req.params.id });
  const ssData = await ssModel.findOne({ _id: req.params.id });
  let doctorInfo = [];
  for (let i = 0; i < ssData.doctorIDs.length; i++) {
    const doc = await eUserModel.findOne({ _id: ssData.doctorIDs[i] });
    doctorInfo.push({
      id: doc._id,
      name: doc.name,
    });
  }
  let serverData = {
    serviceId: req.params.id,
    ourExperts: eUser,
    user: req.user,
    ssData,
    doctorInfo,
  };
  console.log({ serverData });
  // return res.json(serverData)
  return res.render('updateSpecialService.ejs', { serverData });
};

exports.postUpdateSingleSS = async (req, res) => {
  console.log('service data for update:');
  console.log(req.body);
  const {
    id,
    title,
    subTitle,
    description,
    details,
    schedule,
    fee,
    Max,
    image,
    prevImage,
  } = req.body;

  const doctorIDs = JSON.parse(req.body.doctorIDs);
  const doctorNames = JSON.parse(req.body.doctorNames);
  const videos = JSON.parse(req.body.videos);

  await ssModel.findOneAndUpdate(
    { _id: id },
    {
      title: title,
      subTitle: subTitle,
      description: description,
      details: details,
      videos: videos,
      doctorIDs: doctorIDs,
      doctorNames: doctorNames,
      fee: fee,
      capacity: {
        Max: Max,
      },
      schedule: schedule,
    }
  );

  let newFileUploaded = nullChk(image) ? false : true;
  // image name will be updated after file uploading done and prev file deletion done.
  // File uploading and deletion will be done in route named "/admin/specialService/update/file"

  res.send({
    status: true,
    newFileUploaded: newFileUploaded,
    msg: 'Special service updated',
  });
};

exports.deleteSpecialService = async (req, res) => {
  // checker(req, res);
  const id = req.params.id;
  await ssModel.findByIdAndDelete(id);
  res.redirect('/admin/special_service');
};

exports.toggleFeedback = async (req, res) => {
  const { id } = req.params;
  const fb = await Feedback.findOne({ _id: id });
  const display = !fb.onDisplay;
  await Feedback.findOneAndUpdate(
    { _id: id },
    {
      $set: { onDisplay: display },
    }
  );
  return res.send({
    status: true,
    msg: 'display toggled',
  });
};

exports.getExpertPriorities = async (req, res) => {
  let data = await eUserModel.find();
  res.render('adminPriorityListing', { data });
};

exports.setExpertPriorities = async (req, res) => {
  const { id, priority } = req.body;
  await eUserModel.findOneAndUpdate(
    { _id: id },
    { $set: { priority: priority } }
  );
  res.json({
    success: true,
  });
};
