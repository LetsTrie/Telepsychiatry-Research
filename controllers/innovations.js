const innovationModel = require('../models/innovations');
const Joi = require('joi');
const LIMIT = 9

module.exports.getInnovations = async (req, res, next) => {
    const page = req.query.page || 1;
    const data = {
        results: await innovationModel.find().limit(LIMIT).skip(LIMIT * page - LIMIT),
        current: page,
        totalPage: Math.ceil(innovationModel.count() / LIMIT)
    };
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

    const schema = Joi.object().keys({
        _id: Joi.any(),
        title: Joi.string().min(8).required(),
        pageType: Joi.string().required(),
        tags: Joi.array().items(Joi.string().regex(/^([^0-9]+)$/)),
        objective: Joi.string().min(20).required(),
        content: Joi.string().min(20).required(),
        time: Joi.date()
    });

    await Joi.validate(data.toObject(), schema, (err, result) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        else {
            data.save();
            return res.redirect('/innovations');
        }
    });
};
