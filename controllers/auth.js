const country = require('../data/country');
const multer = require('multer');
const path = require('path');
const { gUserModel } = require('../models/generalUser');
const { eUserModel } = require('../models/expertUser');
const { orgUserModel } = require('../models/orgUser');

const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

exports.getRegisterGeneralUser = (req, res, next) => {
  return res.render('register_gen', { country });
};
exports.getRegisterExpertUser = (req, res, next) => {
  return res.render('register_exp', { country });
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
      propicURL: req.file.filename,
    };
    delete userObj['cPassword'];
    const newGenUser = new gUserModel(userObj);
    await newGenUser.save();
    return res.redirect('/');
  } catch (err) {
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

const { regExpUserVal } = require('../validations/auth');
exports.postRegisterExpertUser = async (req, res, next) => {
  console.log('files saved');
  res.redirect('/services/consultation');
};

exports.saveExpUser = async (req, res, next) => {
  const {
    name,
    gender,
    institute,
    expertise,
    designation,
    speciality,
    dob,
    email,
    password,
    phone,
    professionalDegree: profDegree,
    affiliation,
    regno,
    researchArea,
    country,
    fee,
    aboutYourself,
    propicURL,
    cvURL,
  } = req.body;

  const education = JSON.parse(req.body.education);
  const training = JSON.parse(req.body.training);
  const awards = JSON.parse(req.body.awards);
  const workExperience = JSON.parse(req.body.workExperience);
  const visitingHour = JSON.parse(req.body.visitingHour);

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userObj = {
    name,
    gender,
    institute,
    expertise,
    designation,
    speciality,
    dob,
    email,
    password: hashedPassword,
    phone,
    professionalDegree: profDegree,
    affiliation,
    regno,
    researchArea,
    country,
    fee,
    aboutYourself,
    propicURL,
    cvURL,
    education,
    training,
    awards,
    workExperience,
    visitingHour,
  };

  const { error } = regExpUserVal(userObj);
  // console.log(error);
  if (error != null) {
    req.flash('errorMessage', error.details[0].message);
    return res.send({
      status: false,
      message: error.details[0].message,
    });
  }

  const newExpUser = new eUserModel(userObj);
  await newExpUser.save();
  console.log(userObj);
  console.log('exp saved');
  req.flash('successMessage', 'You have successfully been regsitered');
  return res.send({
    status: true,
    message: 'success',
  });
};

exports.postRegisterOrgUser = async (req, res, next) => {
  const {
    name,
    authName,
    authPhoneNumber,
    authEmail,
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
        authEmail: joi
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

    bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const newOrgUser = await new orgUserModel({
          name,
          authName,
          authPhoneNumber,
          authEmail,
          region,
          org_type,
          password,
          establish_year,
          websiteLink,
        }).save();
        console.log('org user saved');
        res.redirect('/');
      });
    });
  } catch (err) {
    console.log(err);
  }
};
