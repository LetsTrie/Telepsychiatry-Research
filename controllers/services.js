const nodemailer = require('nodemailer');
const { eUserModel } = require('../models/expertUser');

exports.consultation = async (req, res) => {
  const experts = await eUserModel.find().sort({ _id: -1 });
  res.render('consultation', {
    experts,
  });
};

const getTheArray = (data) => {
  return typeof data === 'string' ? [data] : data;
};

exports.searchConsultation = async (req, res) => {
  let search = req.query.searchInput;
  let gender = getTheArray(req.query.gender);
  if (search === '') search = undefined;
  if (search === undefined && gender === undefined) {
    const experts = await eUserModel.find().sort({ _id: -1 });
    return res.render('consultation', { experts });
  }
  let searchedExperts = [];
  let genderExperts = [];
  if (search) {
    search = search.trim();
    let searchOptions = {
      $regex: search,
      $options: 'i',
    };
    let searchKey = {
      $or: [
        { name: searchOptions },
        { gender: searchOptions },
        { speciality: searchOptions },
        { designation: searchOptions },
        { affiliation: searchOptions },
        { dob: searchOptions },
        { email: searchOptions },
        { phone: searchOptions },
        { aboutYourself: searchOptions },
        { institute: searchOptions },
        { researchArea: searchOptions },
        { regno: searchOptions },
        { country: searchOptions },
        { fee: searchOptions },
        { expertise: searchOptions },
        { professionalDegree: searchOptions },
        // // { education: searchOptions },
        // // { training: searchOptions },
        // // { awards: searchOptions },
        // // { workExperience: searchOptions },
        // // { visitingHour: searchOptions },
      ],
    };
    searchedExperts = await eUserModel.find(searchKey);
  }
  if (gender) {
    for (let i = 0; i < gender.length; i++) {
      searchKey = { $or: [{ gender: gender[i] }] };
      let docs = await eUserModel.find(searchKey);
      genderExperts.push(...docs);
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

  return res.render('consultation', {
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
