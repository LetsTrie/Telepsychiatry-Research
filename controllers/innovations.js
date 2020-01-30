module.exports.innovations = (req, res, next) => {
    return res.render('innovations');
};

module.exports.createInnovations = (req, res, next) => {
    return res.render('createInnovations');
};

module.exports.postInnovations = (req, res, next) => {
    console.log(req.body);
    return res.render('innovations');
};
