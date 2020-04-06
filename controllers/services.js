const nodemailer = require('nodemailer');

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

const { eUserModel } = require('../models/expertUser');

exports.showAllDoctosConsultation = async (req, res, next) => {
  const doctors = await eUserModel.find().sort({ _id: -1 });
  console.log(doctors);
  return res.render('consultation', { doctors });
};

exports.singleDoctorConsultation = async (req, res, next) => {
  const doc = await eUserModel.findById(req.params.id);
  console.log(doc);
  return res.render('doctorsProfile', { doc });
};
