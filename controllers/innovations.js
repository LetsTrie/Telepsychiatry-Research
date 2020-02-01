const innovationModel = require('../models/innovations');

module.exports.getInnovations = async (req, res, next) => {
  const data = await innovationModel.find();
  return res.render('innovations', { data });
};

module.exports.createInnovations = (req, res, next) => {
  return res.render('createInnovations');
};

module.exports.postInnovations = async (req, res, next) => {
  let { content } = req.body;
  let modifiedContent = content;

  if (content.startsWith('<p>') && content.endsWith('</p>')) {
    modifiedContent = content.substring(3, content.length - 4);
  }

  const data = new innovationModel({
    title: req.body.title,
    pageType: req.body.pagetype,
    tags: req.body.tag.split(','),
    objective: req.body.summary,
    content: modifiedContent
  });
  await data.save();
  return res.redirect('/innovations');
};
