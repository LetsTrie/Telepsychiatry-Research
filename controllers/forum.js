const { forumModel } = require('../models/forum');
const { commentModel } = require('../models/forum');
const { discussionValidation } = require('./validation');
const { makeSmallParagraphFromHTML } = require('./utils');

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
    data: makeSmallParagraphFromHTML(data, 'description'),
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
  const comments = await commentModel.find({ postId: req.params.id });
  return res.render('singleDiscussion', { data, comments });
};

exports.createForum = (req, res, next) => {
  return res.render('createDiscussion');
};

module.exports.postDiscussion = async (req, res, next) => {
  const { error } = discussionValidation(req.body);
  if (error) return res.json({ message: error.details[0].message });
  const { title, tag, content } = req.body;
  const data = new forumModel({
    title: title,
    tags: tag.split(', '),
    description: content
  });
  await data.save();
  return res.redirect('forum');
};

module.exports.postReact = async (req, res, next) => {
  const postId = req.body.id;
  const userId = 'abcdef123456';

  const post = await forumModel.findById(postId);
  if (post.upvotes.includes(userId)) {
    for (let i = 0; i < post.upvotes.length; i++) {
      if (post.upvotes[i] == userId) {
        post.upvotes.splice(i, 1);
        break;
      }
    }
  } else {
    post.upvotes.push(userId);
  }
  await post.save();
};

module.exports.postComment = async (req, res, next) => {
  const data = new commentModel({
    postId: req.body.id,
    userId: '123456',
    content: req.body.comment
  });
  await data.save();
};
