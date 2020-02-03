const innovationModel = require('../models/innovations');
const { innovationValidation } = require('./validation')
const LIMIT = 9

module.exports.getInnovations = async (req, res, next) => {
    const page = req.query.page || 1;
    const data = await innovationModel.find().limit(LIMIT).skip(LIMIT * page - LIMIT);
    const totalPage = Math.ceil(innovationModel.count() / LIMIT);
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page > 1;
    return res.render('innovations', {
        data: data,
        page: page,
        totalPage: totalPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        next: page + 1,
        previous: page - 1
    });
};

module.exports.createInnovations = (req, res, next) => {
    return res.render('createInnovations');
};

module.exports.postInnovations = async (req, res, next) => {
    const { error } = innovationValidation(req.body);
    if (error) {
        console.log(error);
        return res.send(error.details[0].message);
    }

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
