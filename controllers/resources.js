const { ResearchModel } = require('../models/researches');
const LIMIT = 9;
module.exports.get_resources = async (req, res) => {
  const page = +req.query.page || 1;
  const data = await ResearchModel.find()
    .limit(LIMIT)
    .skip(LIMIT * page - LIMIT);
  const totalItems = await ResearchModel.countDocuments();
  res.render('researches', {
    posts: data,
    new: false,
    currentPage: page,
    hasNextPage: page * LIMIT < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / LIMIT)
  });
};

module.exports.post_resources = async (req, res) => {
  const {
    title,
    authors,
    pageType,
    publicationYear,
    summary,
    description
  } = req.body;

  let modifiedAuthors = authors.split(',').map(x => x.trim());
  let modifiedDesciption = description;

  if (description.startsWith('<p>') && description.endsWith('</p>')) {
    modifiedDesciption = description.substring(3, description.length - 4);
  }

  const newResearch = new ResearchModel({
    title,
    authors: modifiedAuthors,
    pageType,
    publicationYear,
    summary,
    description: modifiedDesciption
  });

  await newResearch.save();

  const resources = await ResearchModel.find();
  res.render('researches', {
    posts: resources,
    new: true
  });
};
