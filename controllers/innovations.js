const innovationModel = require('../models/innovations');

module.exports.innovations = async (req, res, next) => {
    await innovationModel.find({}, (err, result) => {
        return res.render('innovations', {
            data: result
        });
    });
};

module.exports.createInnovations = (req, res, next) => {
    return res.render('createInnovations');
};

module.exports.postInnovations = async (req, res, next) => {
    const data = new innovationModel({
        'title': req.body.title,
        'pageType': req.body.pagetype,
        'tags': req.body.tag.split(". "),
        'objective': req.body.summary,
        'content': req.body.content
    });
    await data.save();
    await innovationModel.find({}, (err, result) => {
        return res.render('innovations', {
            data: result
        });
    });
};
