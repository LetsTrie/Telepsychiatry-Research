const path = require('path');
const conCity = require('../data/country');
const country = conCity.map((x) => x.country);
const nodemailer = require('nodemailer');
const passport = require('passport');

const { gUserModel } = require('../models/generalUser');
const { eUserModel } = require('../models/expertUser');
const { orgUserModel } = require('../models/orgUser');
const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { sendGrid } = require('../config/sendMail');


let checkNotNull = (val) => {
  return typeof val != 'undefined' && val != '' && val != null;
};

exports.getMyAppointments = (req, res, next) => {
  return res.render('appointmentListFrExprt');
};

exports.getRegisterGeneralUser = (req, res, next) => {
  return res.render('register_gen', { country, user: req.user });
};
exports.getRegisterOrganizations = (req, res, next) => {
  return res.render('register_org', { country, user: req.user });
};

exports.postUpdateExpertPassword = (req, res, next) =>
  res.render('updateExpertPassword', {
    user: req.user,
  });
exports.postUpdateExpertPicture = (req, res, next) =>
  res.render('updateExpertPhoto', {
    user: req.user,
  });

const { regGenUserVal } = require('../validations/auth');
exports.postRegisterGeneralUser = async (req, res, next) => {
  console.log(req.body);

  try {
    const { error } = regGenUserVal(req.body);
    if (error) {
      req.flash('errorMessage', error.details[0].message);
      return res.redirect('back');
    }
    if (req.body.password != req.body.cPassword) {
      req.flash('errorMessage', 'Password not matching');
      return res.redirect('back');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userObj = {
      ...req.body,
      name: req.body.fname + ' ' + req.body.lname,
      password: hashedPassword,
      propicURL: req.body.filename,
    };
    delete userObj['cPassword'];
    const newGenUser = new gUserModel(userObj);
    await newGenUser.save();
    return res.redirect('/');
  } catch (err) {
    console.log('error ', err);
    return res.status(500).json(err);
  }
};
exports.postCheckDuplication = async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  let user = await gUserModel.findOne({ email });

  let success = true;
  let message = 'EVERYTHING IS OKAY!!';

  if (user) {
    success = false;
    message = 'Email is already used';
  }
  user = await gUserModel.findOne({ phoneNumber });
  if (user) {
    success = false;
    message = 'Phone Number is already used';
  }
  return res.json({ success, message });
};

const admin = require('../config/credentials').adminCredentials;

// admin jeno eta diye dhukte na pare...
// admin er login er upor homepage er kuno effect porbe na...
// admin logged in thakle homapage e authentication related kisui show korbe na..

module.exports.postLogin = async(req, res, next) => {
  console.log(req.body);
  if (req.body.email == admin.email && req.body.password === admin.password) {
    req.flash('errorMessage', 'User not found');
    res.redirect('/auth/login');
  } else {
    let user = await eUserModel.findOne({ email: req.body.email });
    if(!checkNotNull(user)){
      user = await gUserModel.findOne({ email: req.body.email });
    }
    let successUrl = checkNotNull(user)&&checkNotNull(user.otp)
      ? '/auth/resetPass'
      : '/';
    console.log({successUrl})
    // agei sob kore nite hobe...
    passport.authenticate('local', {
      successRedirect: successUrl,
      failureRedirect: '/auth/login',
      failureFlash: true,
    })(req, res, next);
  }
};

exports.getRegisterExpertUser = (req, res, next) => {
  return res.render('register_exp', { country, user: req.user });
};

exports.eUserCheckDuplication = async (req, res, next) => {
  const { email, phone } = req.body;
  let success = true;
  let message = 'OKAY';

  if (phone) {
    let user2 = await eUserModel.findOne({ phone: phone });
    if (user2) {
      success = false;
      message = 'PHONE';
    }
  }
  if (email) {
    let user1 = await eUserModel.findOne({ email: email });
    if (user1) {
      success = false;
      message = 'EMAIL';
    }
  }
  return res.json({ success, message });
};

const { regExpUserVal } = require('../validations/auth');

exports.postRegisterExpertUserFile = async (req, res, next) => {
  console.log('Expert User File Saved.');
  const { speciality } = req.body;
  req.flash(
    'successMessage',
    'A confirmation mail has been sent to your email address. Please verify your email and wait for the admin approval.'
  );
  if (speciality === 'Psychiatric Consultation') {
    return res.redirect('/services/consultation');
  } else if (speciality === 'Researcher') {
    return res.redirect('/services/researchers');
  } else {
    return res.redirect('/services/psychoTherapy');
  }
};

exports.postRegisterExpertUserData = async (req, res, next) => {
  console.log('Expert User: Data Processing. Line: 116');
  const {
    fname,
    lname,
    gender,
    email,
    dob,
    phone,
    password,
    cPassword,
    country,
    city,
    regno,
    propicURL,
    aboutYourself,
    designation,
    affiliation,
    researchArea,
    expertise,
    fee,
    speciality,
  } = req.body;

  const education = JSON.parse(req.body.education);
  const training = JSON.parse(req.body.training);
  const awards = JSON.parse(req.body.awards);
  const workExperience = JSON.parse(req.body.workExperience);
  const visitingHour = JSON.parse(req.body.visitingHour);
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObj = {
    name: fname + ' ' + lname,
    gender,
    email,
    dob,
    phone,
    country,
    city,
    regno,
    propicURL,
    aboutYourself,
    designation,
    affiliation,
    researchArea,
    expertise,
    fee,
    speciality,
    password: hashedPassword,
    education,
    training,
    workExperience,
    visitingHour,
    awards,
  };

  console.log('data started validation');
  const { error } = regExpUserVal(userObj);
  console.log('done with validation');

  if (error != null) {
    console.log('Here is the errors');

    const err = error.details[0].message;
    console.log(err);
    req.flash('errorMessage', err);
    return res.send({ status: false, message: err });
  }

  const newExpUser = new eUserModel(userObj);
  await newExpUser.save()

  const data = {
    address: newExpUser.email,
    subject: 'TRIN Expert account confirmation',
    body: `Please click on <a href="${req.headers.host}auth/verify/${newExpUser._id}">this link</a> to confirm your TRIN account. <br/> Thanks.`
  }
  await sendGrid(data)
  req.flash('successMessage', 'You have successfully been regsitered');
  return res.send({ status: true, message: 'success' });

  // AccountVerifyMail(newExpUser.email, newExpUser._id)
  //   .then(() => newExpUser.save())
  //   .then((resObj) => {
  //     console.log(resObj);
  //     req.flash('successMessage', 'You have successfully been regsitered');
  //     return res.send({ status: true, message: 'success' });
  //   })
  //   .catch((err) => {
  //     req.flash('errorMessage', 'Unexpected Error Occured!');
  //     return res.send({ status: false, message: 'Unexpected Error Occured!' });
  //   });
};

exports.verifyAccount = async (req, res, next) => {
  await eUserModel.updateOne(
    { _id: req.params.id },
    { $set: { isVerified: true } }
  );
  req.flash(
    'successMessage',
    'Congratulations, Your account has been verified !!'
  );
  res.redirect('/');
};

exports.postRegisterOrgUser = async (req, res, next) => {
  const {
    name,
    authName,
    authPhoneNumber,
    email,
    region,
    org_type,
    password,
    establish_year,
    websiteLink,
  } = req.body;
  console.log(req.body);
  try {
    await joi
      .object()
      .keys({
        name: joi.string().required(),
        authName: joi
          .string()
          .required()
          .regex(/^[a-zA-Z ]+$/),
        email: joi
          .string()
          .required()
          .regex(
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          ),
        password: joi.string().required().min(6),
        authPhoneNumber: joi.string().required().regex(/\w+/i).min(6),
        region: joi.string().required(),
        org_type: joi.string().required(),
        websiteLink: joi.string().required(),
        establish_year: joi.string().required(),
      })
      .validate(req.body);
    const hashed = await bcrypt.hash(req.body.password, 10);
    const newOrgUser = await new orgUserModel({
      name,
      authName,
      authPhoneNumber,
      email,
      region,
      org_type,
      password: hashed,
      establish_year,
      websiteLink,
    }).save();
    console.log('org user saved');
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.expProfile = async (req, res, next) => {
  res.render('expertProfile', { user: req.user });
};

//Update profile picture
exports.updateExpertFile = (req, res, next) => {
  console.log('Expert User File Updated.');
  const filePath = path.join(
    process.cwd(),
    '/public',
    '/uploads',
    req.user.propicURL
  );
  fs.unlink(filePath, function (err) {
    const filename = req.body.filename
    eUserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          propicURL: filename,
        },
      },
      () => {
        req.flash('successMessage', 'Your profile picture is now updated');
        res.redirect('/auth/user/profile');
      }
    );
  });
};
exports.getExpUser = async (req, res, next) => {
  let user = req.user;
  if (!user.training.length) {
    user.training = {
      trainingName: '',
      trainingYear: '',
      trainingDetails: '',
    };
  }
  if (!user.workExperience.length) {
    user.workExperience = {
      expInstitute: '',
      expFrom: '',
      expTo: '',
    };
  }
  if (!user.visitingHour.length) {
    user.visitingHour = {
      chamberName: '',
      chamberAddress: '',
      shifts: {
        dayFrom: '',
        dayTo: '',
        timeFrom: '',
        timeTo: '',
      },
    };
  }
  if (!user.awards.length) {
    user.awards = {
      awardsName: '',
      awardsYear: '',
      awardsDetails: '',
    };
  }
  return res.send(user);
};

//Update profile information
exports.getUpdateExpertProfile = async (req, res, next) => {
  let user = req.user;
  console.log(user);
  if (!user.training.length) {
    user.training = {
      trainingName: '',
      trainingYear: '',
      trainingDetails: '',
    };
  }
  if (!user.workExperience.length) {
    user.workExperience = {
      expInstitute: '',
      expFrom: '',
      expTo: '',
    };
  }
  if (!user.visitingHour.length) {
    user.visitingHour = {
      chamberName: '',
      chamberAddress: '',
      shifts: {
        dayFrom: '',
        dayTo: '',
        timeFrom: '',
        timeTo: '',
      },
    };
  }
  if (!user.awards.length) {
    user.awards = {
      awardsName: '',
      awardsYear: '',
      awardsDetails: '',
    };
  }
  res.render('updateExpertProfile', {
    user,
  });
};
exports.postUpdateExpUser = async (req, res, next) => {
  const _education = JSON.parse(req.body.education);
  const _training = JSON.parse(req.body.training);
  const _awards = JSON.parse(req.body.awards);
  const _workExperience = JSON.parse(req.body.workExperience);
  const _visitingHour = JSON.parse(req.body.visitingHour);
  const fullName = req.body.fname + ' ' + req.body.lname;
  await eUserModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        name: fullName,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        dob: req.body.dob,
        aboutYourself: req.body.aboutYourself,
        regno: req.body.regno,
        designation: req.body.designation,
        affiliation: req.body.affiliation,
        expertise: req.body.expertise,
        profHighestDegree: req.body.profHighestDegree,
        country: req.body.country,
        city: req.body.city,
        researchArea: req.body.researchArea,
        fee: req.body.fee,
        speciality: req.body.speciality,
        education: _education,
        training: _training,
        awards: _awards,
        workExperience: _workExperience,
        visitingHour: _visitingHour,
      },
    }
  );
  res.send({
    status: true,
    msg: 'updated',
  });
};

//Update password
exports.changePassword = async (req, res, next) => {
  const newPass = req.body.password;
  const currentPass = req.body.currentPassword;
  const match = await bcrypt.compare(currentPass, req.user.password);
  if (!match) {
    res.send({
      status: false,
    });
  } else {
    const newPassword = await bcrypt.hash(newPass, 10);
    console.log('updated');
    await eUserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          password: newPassword,
        },
      }
    );
    res.send({
      status: true,
    });
  }
};

exports.mail = async () => {
  AccountVerifyMail('safwan.du16@gmail.com', 'iiiidddd');
};

function sendEmail(emailID, userID) {
  var Transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'safwan.du16@gmail.com',
      pass: '',
    },
  });

  var mailOptions;
  const host = `http://localhost:3000`;
  const mailBody = `Click <a href="${host}/auth/verify/${userID}">here</a> to verify your email.`;
  mailOptions = {
    from: 'manager@trin-innovation.com',
    to: emailID,
    subject: 'Reply from TRIN',
    html: mailBody,
  };

  Transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent');
    }
  });
}
