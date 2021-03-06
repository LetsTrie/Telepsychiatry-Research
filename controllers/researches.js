const { ResearchModel } = require('../models/researches');
const { pagination } = require('./utils');
const { makeSmallParagraphFromHTML } = require('./utils');

const LIMIT = 9;

exports.getResearch = async (req, res) => {
  console.log(req.params.id);
  const data = await ResearchModel.findById(req.params.id);
  res.render('singleResearch', { data, user: req.user });
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
    .skip(LIMIT * (page - 1))
  const totalItems = await ResearchModel.find(searchKey).countDocuments();
  return res.render('researches', {
    user: req.user,
    data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
    search,
    ...pagination(page, LIMIT, totalItems, baseUrl),
  });
};

const isExpertDoc = (req) => {
  if (req.user) {
    const sp = req.user.speciality;
    if (sp) {
      return (
        sp === 'Psycho Therapy & Counselling' ||
        sp === 'Researcher' ||
        sp === 'Psychiatric Consultation'
      );
    }
    return false;
  }
  return false;
};

exports.getAllResearches = async (req, res) => {
  let { stage, searchInput, type } = req.query;
  let data;
  // console.log(searchInput);
  if (searchInput) {
    const keyword = {
      researchStage: type,
      isVerified: true,
    };
    searchInput = searchInput.trim();
    let searchOptions = {
      $regex: searchInput,
      $options: 'i',
    };
    let searchKey = {
      $or: [
        { title: searchOptions },
        { description: searchOptions },
        { name: searchOptions },
        { designation: searchOptions },
        { email: searchOptions },
        { phone: searchOptions },
        { collaboration: searchOptions },
        { collabScope: searchOptions },
        { newsAndPub: searchOptions },
      ],
    };
    data = await ResearchModel.find({
      $and: [keyword, searchKey],
    }).sort({ priority: -1, _id: -1 });
    console.log(type);
    if (type == 'ongoing') {
      return res.render('ongoingResearches', {
        data,
        search: null,
        user: req.user,
        showSubmitBtn: isExpertDoc(req),
      });
    } else {
      return res.render('completeResearches', {
        data,
        search: null,
        user: req.user,
        showSubmitBtn: isExpertDoc(req),
      });
    }
  }
  data = await ResearchModel.find({
    researchStage: stage,
    isVerified: true,
  }).sort({ priority: -1, _id: -1 });
  if (stage == 'ongoing') {
    return res.render('ongoingResearches', {
      data,
      search: null,
      user: req.user,
      showSubmitBtn: isExpertDoc(req),
    });
  } else {
    return res.render('completeResearches', {
      data,
      search: null,
      user: req.user,
      showSubmitBtn: isExpertDoc(req),
    });
  }
};

exports.researchFile = async (req, res) => {
  console.log('file saved');
  req.flash(
    'successMessage',
    'Your post has been submitted successfully. Please wait for the admin approval.'
  );
  res.redirect(`/researches?stage=${req.body.researchStage}`);
};
exports.postResearches = async (req, res) => {
  if (!req.user) {
    res.send('User not found');
  }
  const { validateResearchData } = require('../validations/researches');
  const { error } = validateResearchData(req.body);
  if (error) {
    console.log(error);
    res.send({
      status: false,
      msg: error.details[0].message,
    });
  }
  const newResearch = new ResearchModel({
    ...req.body,
    description: makeSmallParagraphFromHTML([req.body], 'description')[0]
      .description,
    authorID: req.user._id,
    isVerified: false,
  });
  console.log(newResearch);
  await newResearch.save();
  res.send({
    status: true,
    msg: 'okay',
  });
};

exports.getNewResearches = (req, res) =>
  res.render('createResearches', { user: req.user });

const path = require('path');
exports.downloadFile = async (req, res) => {
  const filePath = path.join(
    process.cwd(),
    '/public',
    '/research',
    req.params.id
  );
  res.download(filePath);
};

exports.getUpdate = async (req, res) => {
  const data = await ResearchModel.findById(req.params.id);
  res.render('updateResearchesOthers', {
    data,
    user: req.user,
  });
};

exports.postUpdate = async (req, res) => {
  const {
    id,
    title,
    description,
    name,
    designation,
    email,
    phone,
    collaboration,
    collabScope,
    financialSupport,
    newsAndPub,
    researchStage,
  } = req.body;

  await ResearchModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        title: title,
        description: description,
        name: name,
        designation: designation,
        email: email,
        phone: phone,
        collaboration: collaboration,
        collabScope: collabScope,
        financialSupport: financialSupport,
        newsAndPub: newsAndPub,
        researchStage: researchStage,
      },
    }
  );

  return res.send({
    status: true,
    msg: 'okke',
  });
};
