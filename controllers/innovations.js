const InnovationModel = require('../models/innovations');
const { pagination } = require('./utils');
const LIMIT = 2;

exports.getInnovation = async (req, res) => {
  const data = await InnovationModel.findById(req.params.id);
  res.render('singleInnovations', { data });
};

exports.getInnovations = async (req, res, next) => {
  const page = req.query.page || 1;
  const data = await InnovationModel.find()
    .limit(LIMIT)
    .skip((LIMIT - 1) * page);
  const totalItems = await InnovationModel.countDocuments();
  return res.render('innovations', {
    data,
    ...pagination(page, LIMIT, totalItems)
  });
};

exports.createInnovations = async (req, res, next) => {
  const {
    title,
    BriefDesciption,
    conflictOfInterest,
    financialSupport,
    Acknowlegement,
    references,
    authors
  } = req.body;

  let modifiedDesciption = (x = BriefDesciption);

  if (x.startsWith('<p>') && x.endsWith('</p>')) {
    modifiedDesciption = x.substring(3, x.length - 4);
  }

  const newInnovations = new InnovationModel({
    title,
    BriefDesciption: modifiedDesciption,
    conflictOfInterest,
    financialSupport,
    Acknowlegement,
    references,
    authors
  });

  await newInnovations.save();
  res.redirect('/innovations');
};

module.exports.searchInnovations = async (req, res, next) => {
  const { search } = req.body;

  const page = req.query.page || 1;
  const data = await InnovationModel.find({
    $or: [
      {
        title: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        BriefDesciption: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        conflictOfInterest: {
          $regex: search,
          $options: 'i'
        }
      },

      {
        financialSupport: {
          $regex: search,
          $options: 'i'
        }
      },

      {
        Acknowlegement: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        references: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        authors: {
          $regex: search,
          $options: 'i'
        }
      }
    ]
  })
    .limit(LIMIT)
    .skip(LIMIT * page - LIMIT);
  const totalItems = await InnovationModel.find({
    $or: [
      {
        title: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        BriefDesciption: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        conflictOfInterest: {
          $regex: search,
          $options: 'i'
        }
      },

      {
        financialSupport: {
          $regex: search,
          $options: 'i'
        }
      },

      {
        Acknowlegement: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        references: {
          $regex: search,
          $options: 'i'
        }
      },
      {
        authors: {
          $regex: search,
          $options: 'i'
        }
      }
    ]
  }).countDocuments();

  return res.render('innovations', {
    data,
    ...pagination(page, LIMIT, totalItems)
  });
};
// search er por pagination kaj korbe na..
// pagination universal kora hoy nai..
