const {InnovationsModel} = require('../models/innovations');
// const { innovationValidation } = require('./validation')
const LIMIT = 9

module.exports.getInnovations = async (req, res, next) => {
    const page = req.query.page || 1;
    const data = await InnovationsModel.find().limit(LIMIT).skip(LIMIT * page - LIMIT);
    return res.render('innovations', {
        posts: data,
        page: page,
        totalPage: Math.ceil(InnovationsModel.count() / LIMIT)
    });
};

module.exports.createInnovations = (req, res, next) => {
    return res.render('createInnovations');
};

module.exports.postInnovations = async (req, res, next) => {
    const {
        title,
        tags,
        projectType,
        objective,
        description
      } = req.body;
      console.log(req.body)

      let modifiedTags = tags.split(',').map(x => x.trim());
      let modifiedDesciption = description;
    
      if (description.startsWith('<p>') && description.endsWith('</p>')) {
        modifiedDesciption = description.substring(3, description.length - 4);
      }
    
      const newInnnovation = new InnovationsModel({
        title,
        tags: modifiedTags,
        projectType,
        objective,
        description: modifiedDesciption
      });
    
      await newInnnovation.save();
    
      const innovations = await InnovationsModel.find()
      res.render('innovations', {
        posts: innovations,
        new: true
      });
};
