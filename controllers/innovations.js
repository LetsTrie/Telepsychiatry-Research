const innovationModel = require('../models/innovations');

module.exports.innovations = (req, res, next) => {
    innovationModel.find({}, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
    return res.render('innovations');
};

module.exports.createInnovations = (req, res, next) => {
    return res.render('createInnovations');
};

module.exports.postInnovations = async (req, res, next) => {
    if (typeof req.body.tag != 'string') {
        console.log(req.body);
        res.send(typeof req.body.tags);
        return;
    }
    const data = new innovationModel({
        'title': req.body.title,
        'pageType': req.body.pagetype,
        'tags': req.body.tag.split(". "),
        'objective': req.body.summary,
        'content': req.body.content
    });
    console.log(data);
    await data.save();
    return res.render('innovations');
};
