const { forumModel } = require('../models/forum');
const { discussionValidation } = require('./validation');

const LIMIT = 6;

module.exports.getForum = async (req, res, next) => {
    const page = req.query.page || 1;
    const data = await forumModel.find().limit(LIMIT).skip(LIMIT * page - LIMIT);
    for (let i = 0; i < data.length; i++) {
        data[i].user = "Pial Vai";
        console.log(data[i].createdAt.toDateString());
    }
    const totalPage = Math.ceil(forumModel.count() / LIMIT);
    const hasNextPage = page < totalPage;
    const hasPreviousPage = page > 1;
    return res.render('forum', {
        data: data,
        page: page,
        totalPage: totalPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        next: page + 1,
        previous: page - 1
    });
};

module, exports.singleForum = (req, res, next) => {
    return res.render('singleDiscussion');
};

module.exports.createForum = (req, res, next) => {
    return res.render('createDiscussion');
};

module.exports.postDiscussion = async (req, res, next) => {
    const { error } = discussionValidation(req.body);
    if (error) {
        console.log(error);
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