const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');
const { ResearchModel } = require('../models/researches');
const InnovationModel = require('../models/innovations');

const LIMIT = 9;

exports.login = (req, res, next) => res.render('adminLogin');

exports.contactUs = async (req, res, next) => {
  const page = +req.query.page || 1;
  const data = await contactUsModel
    .find()
    .limit(LIMIT)
    .skip(LIMIT * (page - 1))
    .sort({ _id: -1 });
  const totalItems = await contactUsModel.find().countDocuments();
  return res.render('adminContactUs', {
    data,
    ...pagination(page, LIMIT, totalItems, '/admin/contactUs?page=')
  });
};

exports.adminGetResearch = async (req, res) => {
  const page = +req.query.page || 1;
  const search = req.query.search;
  let searchKey = { isVerified: false };
  let baseUrl = req.baseUrl;
  if (search) {
    baseUrl += `?search=${search}&page=`;
    const searchOption = {
      $regex: search,
      $options: 'i'
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
        { isVerified: false }
      ]
    };
  } else baseUrl += `?page=`;

  const data = await ResearchModel.find(searchKey)
    .limit(LIMIT)
    .skip(LIMIT * (page - 1));
  const totalItems = await ResearchModel.find(searchKey).countDocuments();
  return res.render('adminResearch', {
    data,
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl)
  });
};

exports.getResearch = async (req, res) => {
  const data = await ResearchModel.findById(req.params.id);
  res.render('adminSingleResearch', { data });
};

exports.approveResearch = async (req, res) => {
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
  const page = +req.query.page || 1;
  const search = req.query.search;
  let searchKey = { isVerified: false };
  let baseUrl = req.baseUrl;
  if (search) {
    baseUrl += `?search=${search}&page=`;
    const searchOption = {
      $regex: search,
      $options: 'i'
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
        { isVerified: false }
      ]
    };
  } else baseUrl += `?page=`;

  const data = await InnovationModel.find(searchKey)
    .limit(LIMIT)
    .skip(LIMIT * (page - 1));
  const totalItems = await InnovationModel.find(searchKey).countDocuments();
  return res.render('adminInnovations', {
    data,
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl)
  });
};

exports.singleInnoavtion = async (req, res) => {
  const data = await InnovationModel.findById(req.params.id);
  res.render('adminSingleInnovation', { data });
};

exports.approveInnovation = async (req, res) => {
  const id = req.params.id;
  console.log('approve');
  InnovationModel.updateOne(
    { _id: id },
    { $set: { isVerified: true } },
    (err, docs) => {
      res.redirect('/admin/get_innovation');
    }
  );
};

exports.disapproveInnovation = async (req, res) => {
  const id = req.params.id;
  InnovationModel.updateOne(
    { _id: id },
    { $set: { isVerified: false } },
    (err, docs) => {
      console.log('disapprove');
      res.redirect('/admin/get_innovation');
    }
  );
};

const docInfo = require('../data/dummyDataForDoctor');

exports.addDoctor = async (req, res, next) => {
  return res.json(req.body);
};
