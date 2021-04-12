const nodemailer = require('nodemailer');
const { eUserModel } = require('../models/expertUser');
const { gUserModel } = require('../models/generalUser')
const { appointment } = require('../models/appointment.js');
const { Emergency } = require('../models/emergency.js');
const { Feedback } = require('../models/feedback.js');
const { sendGrid } = require('../config/sendMail')
const fs = require('fs')
const path = require('path')

exports.getBookAppointment = async (req, res, next) => {
  const data = await eUserModel.findById(req.params.expID);
  return res.render('newBookAppointment', { user: req.user, data });
};

const getTimesArray = (user) => {
  const times = [];
  const vis = user.visitingHour;
  const generalize = (tm) => {
    let t = tm.trim();
    let fr = t.split(':')[0];
    if (fr.length !== 2) fr = `0${fr}`;
    return `${fr}:00 ${t[t.length - 2]}${t[t.length - 1]}`;
  };
  for (let i = 0; i < vis.length; i++) {
    for (let j = 0; j < vis[i].shifts.length; j++) {
      const sh = vis[i].shifts[j];
      times.push({
        chamberName: vis[i].chamberName,
        chamberAddress: vis[i].chamberAddress,
        dayFrm: sh.dayFrom,
        dayTo: sh.dayTo,
        timeFrm: generalize(sh.timeFrom),
        timeTo: generalize(sh.timeTo),
      });
    }
  }
  return times;
};

const mapping = {
  Saturday: 0,
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
};

exports.getChamberTimes = async (req, res, next) => {
  let { id: expID, day } = req.query;
  let user = await eUserModel.findById(expID);
  let times = getTimesArray(user);

  let mp = mapping[day];
  let newTimeArray = [];
  for (let i = 0; i < times.length; i++) {
    let mpfrm = mapping[times[i].dayFrm];
    let mpto = mapping[times[i].dayTo];
    for (let j = mpfrm; ; j++, j %= 7) {
      if (j === mp) newTimeArray.push(times[i]);
      if (j === mpto) break;
    }
  }
  let hours = new Array(24).fill(0);

  let makeNum = (data) => {
    let tm = parseInt(data.split(':')[0]);
    if (data[data.length - 2] === 'P') tm = (tm % 12) + 12;
    return tm;
  };

  let numberToTime = (data) => {
    const make2 = (x) => {
      let str = x.toString();
      if (str.length === 1) str = `0${str}`;
      return str;
    };
    const prep = (x) => {
      if (x < 12) {
        return `${make2(x)}:00 AM`;
      } else {
        if (x > 12) return `${make2(x % 12)}:00 PM`;
        return `${make2(x)}:00 PM`;
      }
    };
    return `${prep(data)} - ${prep(data + 1)}`;
  };

  for (let i = 0; i < newTimeArray.length; i++) {
    let tmFrm = makeNum(newTimeArray[i].timeFrm);
    let tmTo = makeNum(newTimeArray[i].timeTo);
    for (let j = tmFrm; j < tmTo; j++) {
      if (hours[j] !== 0) {
        hours[j].loc.push({
          chamName: newTimeArray[i].chamberName,
          chamAdd: newTimeArray[i].chamberAddress,
        });
      } else {
        hours[j] = {
          loc: [
            {
              chamName: newTimeArray[i].chamberName,
              chamAdd: newTimeArray[i].chamberAddress,
            },
          ],
          time: numberToTime(j),
        };
      }
    }
  }
  const fl = hours.filter((x) => x !== 0);
  console.log(fl.length);
  return res.json({ times: fl });
};

const getTheArray = (data) => {
  return typeof data === 'string' ? [data] : data;
};

const nullCheck = (data) => {
  return data === '' || data === null || data === undefined;
};

exports.getAllResearchers = async (req, res, next) => {
  const experts = await eUserModel
    .find({ speciality: 'Researcher' })
    .sort({ _id: -1 });
  res.render('researcherList', { experts, user: req.user });
};

exports.searchResearchers = async (req, res, next) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  let city = getTheArray(req.query.city);
  const keyword = { speciality: 'Researcher' };

  if (search === '') search = undefined;
  if (nullCheck(search) && nullCheck(gender) && nullCheck(city)) {
    const experts = await eUserModel.find(keyword).sort({ _id: -1 });
    return res.render('consultation', { experts, user: req.user });
  }

  let searchedExperts = [];
  let genderExperts = [];
  let cityExperts = [];
  if (search) {
    search = search.trim();
    let searchOptions = {
      $regex: search,
      $options: 'i',
    };
    let searchKey = {
      $or: [
        { name: searchOptions },
        { email: searchOptions },
        { gender: searchOptions },
        { speciality: searchOptions },
        { designation: searchOptions },
        { affiliation: searchOptions },
        { dob: searchOptions },
        { phone: searchOptions },
        { aboutYourself: searchOptions },
        { profHighestDegree: searchOptions },
        { profDegreeArea: searchOptions },
        { researchArea: searchOptions },
        { regno: searchOptions },
        { country: searchOptions },
        { city: searchOptions },
        { fee: searchOptions },
        { expertise: searchOptions },
      ],
    };
    searchedExperts = await eUserModel.find({
      $and: [keyword, searchKey],
    });
  }
  if (gender) {
    for (let i = 0; i < gender.length; i++) {
      searchKey = { $or: [{ gender: gender[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      genderExperts.push(...docs);
    }
  }
  if (city) {
    for (let i = 0; i < city.length; i++) {
      searchKey = { $or: [{ city: city[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      cityExperts.push(...docs);
    }
  }
  const map = new Map();
  const container = [];
  for (let i = 0; i < searchedExperts.length; i++) {
    const id = searchedExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(searchedExperts[i]);
  }

  for (let i = 0; i < genderExperts.length; i++) {
    const id = genderExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(genderExperts[i]);
  }

  for (let i = 0; i < cityExperts.length; i++) {
    const id = cityExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(cityExperts[i]);
  }

  return res.render('researcherList', {
    user: req.user,
    experts: container.sort((a, b) => (a._id > b._id ? -1 : 1)),
  });
};

exports.consultation = async (req, res) => {
  req.session.prev = 'consultation';
  let experts = await eUserModel
    .find({ speciality: 'Psychiatric Consultation' })
    .sort({ priority: -1 });
  res.render('consultation', { experts, user: req.user });
};
exports.searchConsultation = async (req, res) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  let city = getTheArray(req.query.city);
  const keyword = { speciality: 'Psychiatric Consultation' };

  if (search === '') search = undefined;
  if (nullCheck(search) && nullCheck(gender) && nullCheck(city)) {
    const experts = await eUserModel.find(keyword).sort({ _id: -1 });
    return res.render('consultation', { experts, user: req.user });
  }

  let searchedExperts = [];
  let genderExperts = [];
  let cityExperts = [];
  if (search) {
    search = search.trim();
    let searchOptions = {
      $regex: search,
      $options: 'i',
    };
    let searchKey = {
      $or: [
        { name: searchOptions },
        { email: searchOptions },
        { gender: searchOptions },
        { speciality: searchOptions },
        { designation: searchOptions },
        { affiliation: searchOptions },
        { dob: searchOptions },
        { phone: searchOptions },
        { aboutYourself: searchOptions },
        { profHighestDegree: searchOptions },
        { profDegreeArea: searchOptions },
        { researchArea: searchOptions },
        { regno: searchOptions },
        { country: searchOptions },
        { city: searchOptions },
        { fee: searchOptions },
        { expertise: searchOptions },
        // {
        //   education: [
        //     {
        //       eduInstitute: searchOptions,
        //       degree: searchOptions,
        //       eduFrom: searchOptions,
        //       eduTo: searchOptions,
        //     },
        //   ],
        // },
        // // { training: searchOptions },
        // // { awards: searchOptions },
        // // { workExperience: searchOptions },
        // // { visitingHour: searchOptions },
      ],
    };
    searchedExperts = await eUserModel.find({
      $and: [keyword, searchKey],
    });
  }
  if (gender) {
    for (let i = 0; i < gender.length; i++) {
      searchKey = { $or: [{ gender: gender[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      genderExperts.push(...docs);
    }
  }
  if (city) {
    for (let i = 0; i < city.length; i++) {
      searchKey = { $or: [{ city: city[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      cityExperts.push(...docs);
    }
  }
  const map = new Map();
  const container = [];
  for (let i = 0; i < searchedExperts.length; i++) {
    const id = searchedExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(searchedExperts[i]);
  }

  for (let i = 0; i < genderExperts.length; i++) {
    const id = genderExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(genderExperts[i]);
  }

  for (let i = 0; i < cityExperts.length; i++) {
    const id = cityExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(cityExperts[i]);
  }

  return res.render('consultation', {
    user: req.user,
    experts: container.sort((a, b) => (a._id > b._id ? -1 : 1)),
  });
};

exports.psychoTherapy = async (req, res) => {
  req.session.prev = 'psychoTherapy';
  const experts = await eUserModel
    .find({ speciality: 'Psycho Therapy & Counselling' })
    .sort({ priority: -1 });
  res.render('psycho_therapy', { experts, user: req.user });
};

exports.searchPsychoTherapy = async (req, res) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  let city = getTheArray(req.query.city);
  const keyword = { speciality: 'Psycho Therapy & Counselling' };

  if (search === '') search = undefined;
  if (nullCheck(search) && nullCheck(gender) && nullCheck(city)) {
    const experts = await eUserModel.find(keyword).sort({ _id: -1 });
    return res.render('psycho_therapy', { experts, user: req.user });
  }

  let searchedExperts = [];
  let genderExperts = [];
  let cityExperts = [];
  if (search) {
    search = search.trim();
    let searchOptions = {
      $regex: search,
      $options: 'i',
    };
    let searchKey = {
      $or: [
        { name: searchOptions },
        { email: searchOptions },
        { gender: searchOptions },
        { speciality: searchOptions },
        { designation: searchOptions },
        { affiliation: searchOptions },
        { dob: searchOptions },
        { phone: searchOptions },
        { aboutYourself: searchOptions },
        { profHighestDegree: searchOptions },
        { profDegreeArea: searchOptions },
        { researchArea: searchOptions },
        { regno: searchOptions },
        { country: searchOptions },
        { city: searchOptions },
        { fee: searchOptions },
        { expertise: searchOptions },
        // {
        //   education: [
        //     {
        //       eduInstitute: searchOptions,
        //       degree: searchOptions,
        //       eduFrom: searchOptions,
        //       eduTo: searchOptions,
        //     },
        //   ],
        // },
        // // { training: searchOptions },
        // // { awards: searchOptions },
        // // { workExperience: searchOptions },
        // // { visitingHour: searchOptions },
      ],
    };
    searchedExperts = await eUserModel.find({
      $and: [keyword, searchKey],
    });
  }
  if (gender) {
    for (let i = 0; i < gender.length; i++) {
      searchKey = { $or: [{ gender: gender[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      genderExperts.push(...docs);
    }
  }
  if (city) {
    for (let i = 0; i < city.length; i++) {
      searchKey = { $or: [{ city: city[i] }] };
      let docs = await eUserModel
        .find({
          $and: [keyword, searchKey],
        })
        .sort({ _id: -1 });
      cityExperts.push(...docs);
    }
  }
  const map = new Map();
  const container = [];
  for (let i = 0; i < searchedExperts.length; i++) {
    const id = searchedExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(searchedExperts[i]);
  }

  for (let i = 0; i < genderExperts.length; i++) {
    const id = genderExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(genderExperts[i]);
  }

  for (let i = 0; i < cityExperts.length; i++) {
    const id = cityExperts[i]._id.toString().trim();
    if (map.has(id)) continue;
    map.set(id, true);
    container.push(cityExperts[i]);
  }

  return res.render('psycho_therapy', {
    user: req.user,
    experts: container.sort((a, b) => (a._id > b._id ? -1 : 1)),
  });
};
exports.getEmBooking = async (req, res) => {
  let creds = {};
  if (req.query) {
    const { name, age, email, phone } = req.query;
    creds = {
      name,
      age,
      email,
      phone,
    };
  }
  return res.render('newEmergencyAppointment', { creds });
};
exports.emergenceBooking = async (req, res) => {
  console.log(req.body);
  const newEm = new Emergency(req.body);
  await newEm.save();
  res.send({
    status: true,
    msg: 'You will get notified the exact time through your email',
  });
};

exports.getEmergency = async (req, res) => {
  const { type } = req.query;
  let data;
  if (type == 'taken') {
    data = await Emergency.find({
      doctorID: req.user._id,
      service: req.user.speciality,
      status: type,
    }).sort({ _id: -1 });
  } else {
    data = await Emergency.find({
      service: req.user.speciality,
      status: type,
    }).sort({ _id: -1 });
  }

  res.render('emergencyAppointments', {
    cat: type,
    data,
  });
};

exports.approveEmergency = async (req, res) => {
  let emApt = await Emergency.findOne({ _id: req.params.id });
  isTaken = emApt.status;
  console.log(isTaken);
  if (isTaken == 'taken') {
    req.flash(
      'errorMessage',
      'This emergency appointment has already been taken.'
    );
    res.redirect('back');
  } else {
    await Emergency.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: 'taken',
          doctorID: req.user._id,
        },
      }
    );
    sendEmergencyLink(
      emApt.email,
      emApt.service,
      emApt.name,
      req.user.name,
      emApt._id
    );
    res.redirect('back');
  }
};

exports.bookAppointment = async (req, res) => {
  console.log(req.body);
  let startTime = req.body.time.split('-')[0].trim();
  if (startTime[startTime.length - 2] == 'P') {
    let dg = parseInt(startTime.split(':')[0]);
    startTime = dg !== 12 ? dg + 12 : dg;
  } else {
    startTime = parseInt(startTime.split(':')[0]) % 12;
  }
  console.log(startTime);
  const rDate = req.body.date.split('/').map((x) => parseInt(x));
  console.log(rDate, startTime);
  sTime = new Date(rDate[2], rDate[1] - 1, rDate[0], startTime, 0, 0, 0);
  const obj = {
    ...req.body,
    startTime: sTime,
  };
  const newApt = new appointment(obj);
  console.log(newApt);
  await newApt.save();
  res.send({
    status: true,
    prev: req.body.speciality,
    msg: 'You will get notified the exact time through your email',
  });
};

exports.allAppointments = async (req, res) => {
  const { type } = req.query;
  let data;
  if (type) {
    if (type == 'unseen') {
      data = await appointment
        .find({
          doctorId: req.user._id,
          isConfirmed: false,
        })
        .sort({ _id: -1 });
      return res.render('appointmentListFrExprt', {
        user: req.user,
        data,
        cat: 'Unseen',
      });
    } else if (type == 'upcoming') {
      data = await appointment
        .find({
          doctorId: req.user._id,
          startTime: { $gte: new Date() },
          isConfirmed: true,
        })
        .sort({ _id: -1 });
      return res.render('appointmentListFrExprt', {
        user: req.user,
        data,
        cat: 'Upcoming',
      });
    } else if (type == 'current') {
      data = await appointment
        .find({
          doctorId: req.user._id,
          startTime: { $lte: new Date() },
          isConfirmed: true,
        })
        .sort({ _id: -1 });
      return res.render('appointmentListFrExprt', {
        user: req.user,
        data,
        cat: 'Current',
      });
    } else {
      data = await appointment
        .find({ doctorId: req.user._id })
        .sort({ _id: -1 });
      return res.render('appointmentListFrExprt', {
        user: req.user,
        data,
        cat: 'All',
      });
    }
  }
  data = await appointment.find({ doctorId: req.user._id }).sort({ _id: -1 });
  return res.render('appointmentListFrExprt', {
    user: req.user,
    data,
    cat: 'All',
  });
};

exports.dateTimeReset = async (req, res) => {
  const { id, email, date, time } = req.body;
  const doctor = req.user.name;
  console.log(req.body);
  let patient = await appointment.findOne({ _id: id });
  patient = patient.name;
  await appointment.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        date: date,
        time: time,
        isConfirmed: true,
      },
    }
  );
  sendSMTP(email, date, time, doctor, id, patient);
  res.redirect('back');
};

function sendEmail(emailID, reply) {
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

exports.singleDoctorConsultation = async (req, res, next) => {
  const { type, id } = req.params
  let doc
  if (type == 'general') {
    doc = await gUserModel.findById(id);
    return res.render('generalUserProfile', { doc, user: req.user });
  } else {
    doc = await eUserModel.findById(id);
    return res.render('doctorsProfile', { doc, user: req.user });
  }
};

// send mail to the patient
const smtpTransport = nodemailer.createTransport({
  host: 'mail.trin-innovation.com.netsolmail.net.',
  port: 587,
  auth: {
    user: 'manager@trin-innovation.com',
    pass: 'Mwjwy45@trin',
  },
  logger: true,
  debug: true,
  secureConnection: 'false',
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

const sendSMTP = async (email, date, time, doctor, id, name) => {
  const mailBody = `
        Dear <strong> ${name} </strong>, <br>
Your Appointment with ${doctor} confirms on ${date} at ${time}. <br>
Thank you for choosing TRIN Innovation Ltd.
    `;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'TRIN - Time and date confirmation',
    html: mailBody,
  };

  return await smtpTransport.sendMail(mailOptions);
};

const sendEmergencyLink = async (email, service, name, doctor, id) => {
  const data = {
    address: email,
    subject: 'TRIN - Emergency booking confirmation',
    body: `
        Dear <strong> ${name} </strong>, <br>
Your Appointment for ${service} with ${doctor} is confirmed. <br>
Please visit this <a href="https://meet.jit.si/services/consultation/${id}" target="_blank">link</a> to participate in the video conference. <br>
Thank you for choosing TRIN Innovation Ltd.
    `
  }
  await sendGrid(data)
};

// special services
const { ssModel } = require('../models/specialService.js');
const { ssBookModel } = require('../models/ss_book.js');
const { fstat } = require('fs');

exports.allSS = async (req, res) => {
  const data = await ssModel.find();
  return res.render('specialServices', {
    user: req.user,
    data,
  });
};

exports.singleSS = async (req, res, next) => {
  const data = await ssModel.findOne({ _id: req.params.id });
  let doctorInfo = [];
  for (let i = 0; i < data.doctorIDs.length; i++) {
    const doc = await eUserModel.findOne({ _id: data.doctorIDs[i] });
    doctorInfo.push({
      image: doc.propicURL,
      designation: doc.designation,
    });
  }
  const feedbacks = await Feedback.find({
    service_id: req.params.id,
    onDisplay: true,
  });
  return res.render('singleSpecialService', {
    serviceId: req.params.id,
    user: req.user,
    data,
    doctorInfo,
    feedbacks,
  });
};

exports.bookSS = async (req, res) => {
  const data = await ssModel.findOne({ _id: req.params.id });

  if (!req.user) {
    req.flash('errorMessage', 'You must be logged in to book this appointment');
    return res.redirect('back');
  } else if (data.capacity.Max <= data.capacity.alottedPatients) {
    req.flash(
      'errorMessage',
      'This service is closed for this week. Try again next week'
    );
    return res.redirect('back');
  } else {
    res.render('newSSBook', {
      user: req.user,
      data,
    });
  }
};

exports.postBookSS = async (req, res) => {
  if (req.user) {
    const { name, bookingType } = req.body
    const obj = {
      ...req.body,
      patient_id: req.user._id,
    };
    const newBook = new ssBookModel(obj);
    console.log(newBook);
    await newBook.save();

    res.send({
      status: true,
      msg:
        'Booking recieved. You will be informed via the email address you provided',
    });
  }
};

exports.addFeedback = async (req, res) => {
  if (req.user) {
    const obj = {
      ...req.body,
      user_id: req.user._id,
      user_name: req.user.name,
    };
    const feedback = new Feedback(obj);
    console.log(feedback);
    await feedback.save();
    return res.send({
      status: true,
      msg: 'Your feedback has been recoreded. Thanks for your concern',
    });
  }
};

exports.addFeedbackVideo = async (req, res) => {
  console.log('ss feedback vidoe added');
  res.redirect('back');
};

exports.staticPageLoader = async (req, res) => {
  const unSlug = s => { return s.split('-').map(word => word.charAt(0).toUpperCase() + word.substr(1, word.length - 1)).join(' ') }
  const { id } = req.params
  let data = await fs.readFileSync(path.join(__dirname, '..', 'data', 'static-files', id + '.txt'), 'utf8')
  res.render('static-service', {
    title: unSlug(id),
    data
  })
}