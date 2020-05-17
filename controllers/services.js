const nodemailer = require('nodemailer');
const { eUserModel } = require('../models/expertUser');

exports.getBookAppointment = async (req, res, next) => {
  const doc = await eUserModel.findById(req.params.expID);
  return res.render('newBookAppointment', { user: req.user, doc });
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
  const experts = await eUserModel
    .find({ speciality: 'Psychiatric Consultation' })
    .sort({ _id: -1 });
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
  const experts = await eUserModel
    .find({ speciality: 'Psycho Therapy & Counselling' })
    .sort({ _id: -1 });
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

exports.bookAppointment = async (req, res) => {
  const { service, name, contact, age, bookType, date, time } = req.body;
  console.log(req.body);
  const reply = `Person with following details is in need of emergency <strong>${service}</strong> service. 
      <br> 
      <hr>
      Name: <strong>${name} </strong> 
      <br>
      Contact: <strong>${contact} </strong> 
      <br>
      Age: <strong>${age} </strong>
      <br>
      Booking Type: <strong>${bookType} </strong> 
      <br>
      Date: <strong>${date} </strong>
      <br>
      Time: <strong>${time} </strong>
      <br> 
          - Thank you. TRIN`;
  const email1 = 'safwan.du16@gmail.com';
  const email2 = 'inzimunna@gmail.com';
  sendEmail(email1, reply);
  sendEmail(email2, reply);
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
  const doc = await eUserModel.findById(req.params.id);
  console.log(doc);
  return res.render('doctorsProfile', { doc, user: req.user });
};
