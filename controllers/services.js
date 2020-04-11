const nodemailer = require('nodemailer');
const { eUserModel } = require('../models/expertUser');

const getTheArray = (data) => {
  return typeof data === 'string' ? [data] : data;
};

const nullCheck = (data) => {
  return data === '' || data === null || data === undefined;
};

exports.consultation = async (req, res) => {
  const experts = await eUserModel
    .find({ speciality: 'Psychiatric Consultations' })
    .sort({ _id: -1 });
  res.render('consultation', { experts });
};
exports.searchConsultation = async (req, res) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  let city = getTheArray(req.query.city);
  const keyword = { speciality: 'Psychiatric Consultations' };

  if (search === '') search = undefined;
  if (nullCheck(search) && nullCheck(gender) && nullCheck(city)) {
    const experts = await eUserModel.find(keyword).sort({ _id: -1 });
    return res.render('consultation', { experts });
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
    experts: container.sort((a, b) => (a._id > b._id ? -1 : 1)),
  });
};

exports.psychoTherapy = async (req, res) => {
  const experts = await eUserModel
    .find({ speciality: 'Psycho Therapy & Counselling' })
    .sort({ _id: -1 });
  res.render('psycho_therapy', { experts });
};

exports.searchPsychoTherapy = async (req, res) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  let city = getTheArray(req.query.city);
  const keyword = { speciality: 'Psycho Therapy & Counselling' };

  if (search === '') search = undefined;
  if (nullCheck(search) && nullCheck(gender) && nullCheck(city)) {
    const experts = await eUserModel.find(keyword).sort({ _id: -1 });
    return res.render('psycho_therapy', { experts });
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
  return res.render('doctorsProfile', { doc });
};
