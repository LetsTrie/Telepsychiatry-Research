const { ResearchModel } = require('../models/researches');
const { pagination } = require('./utils');
const { makeSmallParagraphFromHTML } = require('./utils');

const LIMIT = 9;

exports.getResearch = async (req, res) => {
  const data = await ResearchModel.findById(req.params.id);
  res.render('adminSingleResearch', { data });
};

exports.getResearches = async (req, res) => {
  const page = +req.query.page || 1;
  const search = req.query.search;
  let searchKey = { isVerified: true };
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
      ],
    };
  } else baseUrl += `?page=`;

  const data = await ResearchModel.find(searchKey)
    .limit(LIMIT)
    .skip(LIMIT * (page - 1));
  const totalItems = await ResearchModel.find(searchKey).countDocuments();
  return res.render('researches', {
    data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

exports.postResearches = async (req, res) => {
  const newResearch = new ResearchModel({ ...req.body });
  await newResearch.save();
  res.redirect('/researches');
};

exports.getNewResearches = (req, res) => {
  return res.render('createResearches');
};
