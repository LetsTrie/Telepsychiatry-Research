const { forumModel } = require('../models/forum');
const { discussionValidation } = require('./validation');

const LIMIT = 6;

exports.getForums = async (req, res, next) => {
  const page = +req.query.page || 1;
  const data = await forumModel
    .find()
    .limit(LIMIT)
    .skip(LIMIT * page - LIMIT);

  for (let i = 0; i < data.length; i++) {
    data[i].username = 'Pial';
  }
  const totalItems = await forumModel.countDocuments();

  return res.render('forum', {
    data: data,
    currentPage: page,
    hasNextPage: page * LIMIT < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / LIMIT),
    URL: '/forum?page='
  });
};

exports.singleForum = async (req, res, next) => {
  const data = await forumModel.findById(req.params.id);
  data.username = 'Pial';
  return res.render('singleDiscussion', { data });
};

exports.createForum = (req, res, next) => {
  return res.render('createDiscussion');
};

module.exports.postDiscussion = async (req, res, next) => {
  const { error } = discussionValidation(req.body);
  if (error) {
    return res.send(error.details[0].message);
  }
  let { content } = req.body;
  let modifiedContent = content;

  if (content.startsWith('<p>') && content.endsWith('</p>')) {
    modifiedContent = content.substring(3, content.length - 4);
  }

  const data = new forumModel({
    title: req.body.title,
    tags: req.body.tag.split(', '),
    description: modifiedContent
  });

  await data.save();

  return res.redirect('forum');
};