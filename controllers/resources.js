const { ResearchModel } = require('../models/researches');
const LIMIT = 9;

module.exports.getSingleResearch = async(req, res) => {
    const id = req.params.id
    const singleResearch = await ResearchModel.findOne({ _id: id })
    res.render('singleResearch', {
        data: singleResearch
    })
}

module.exports.get_resources = async(req, res) => {
    const page = +req.query.page || 1;
    const data = await ResearchModel.find()
        .limit(LIMIT)
        .skip(LIMIT * page - LIMIT);
    const totalItems = await ResearchModel.countDocuments();
    res.render('researches', {
        posts: data,
        new: false,
        currentPage: page,
        hasNextPage: page * LIMIT < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / LIMIT)
    });
};

module.exports.post_resources = async(req, res) => {
    const {
        title,
        BriefDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    } = req.body;

    let modifiedDesciption = BriefDesciption;

    if (BriefDesciption.startsWith('<p>') && BriefDesciption.endsWith('</p>')) {
        modifiedDesciption = BriefDesciption.substring(3, BriefDesciption.length - 4);
    }

    const newResearch = new ResearchModel({
        title,
        BriefDesciption: modifiedDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    });

    await newResearch.save();
    res.redirect('/researches')
};