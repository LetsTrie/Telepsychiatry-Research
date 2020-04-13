const conCity = require('../data/country');
const country = conCity.map((x) => x.country);
const nodemailer = require('nodemailer');
const passport = require('passport');

const { gUserModel } = require('../models/generalUser');
const { eUserModel } = require('../models/expertUser');
const { orgUserModel } = require('../models/orgUser');

const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const { AccountVerifyMail } = require('../config/sendMail');

exports.getRegisterGeneralUser = (req, res, next) => {
  return res.render('register_gen', { country });
};
exports.getRegisterOrganizations = (req, res, next) => {
  return res.render('register_org', { country });
};
const { regGenUserVal } = require('../validations/auth');
exports.postRegisterGeneralUser = async (req, res, next) => {
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

module.exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
};

exports.getRegisterExpertUser = (req, res, next) => {
  return res.render('register_exp', { country });
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
  if (speciality == 'Psychiatric Consultations')
    res.redirect('/services/consultation');
  else res.redirect('/services/psychoTherapy');
};

exports.postRegisterExpertUserData = async (req, res, next) => {
  console.log('Expert User Data Saved. Line: 116');
  console.log(req.body);

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
    profHighestDegree,
    profDegreeArea,
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
    profHighestDegree,
    profDegreeArea,
    fee,
    speciality,
    password: hashedPassword,
    education,
    training,
    workExperience,
    visitingHour,
    awards,
  };

  const { error } = regExpUserVal(userObj);
  if (error != null) {
    const err = error.details[0].message;
    req.flash('errorMessage', err);
    return res.send({ status: false, message: err });
  }

  const newExpUser = new eUserModel(userObj);
  console.log('New Exp User: Line 188: (Before mongo Save)', newExpUser);
  await newExpUser.save();
  await AccountVerifyMail(newExpUser.email, newExpUser._id);
  req.flash('successMessage', 'You have successfully been regsitered');
  return res.send({ status: true, message: 'success' });
};

exports.verifyAccount = async (req, res, next) => {
  await eUserModel.updateOne(
    { _id: req.params.id },
    { $set: { isVerified: true } }
  );
  req.flash('successMessage', 'Your Email has been verified.');
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
  const id = req.params.id;
  const expert = await eUserModel.findOne({ _id: id });
  const general = await gUserModel.findOne({ _id: id });
  const org = await orgUserModel.findOne({ _id: id });
  if (expert) {
    res.send(expert);
  } else if (general) {
    res.send(general);
  } else if (org) {
    res.send(org);
  }
};
