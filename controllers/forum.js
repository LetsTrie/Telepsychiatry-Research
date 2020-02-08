const { forumModel } = require('../models/forum');

module.exports.getForum = (req, res, next) => {
    return res.render('forum');
}

module, exports.singleForum = (req, res, next) => {
    return res.render('singleDiscussion');
}

module.exports.createForum = (req, res, next) => {
    const {
        title,
        tag,
        content
    } = req.body;
    return res.render('createDiscussion');
}
