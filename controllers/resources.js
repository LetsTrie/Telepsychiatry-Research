const { ResearchModel } = require("../models/researches");

module.exports.get_resources = async(req, res) => {
    const resources = await ResearchModel.find()
    res.render('researches', {
        posts: resources,
        new: false
    })
}

module.exports.post_resources = async(req, res) => {
    const {
        title,
        authors,
        pageType,
        publicationYear,
        summary,
        description
    } = req.body;

    let modifiedAuthors = authors.split(',').map(x => x.trim());
    let modifiedDesciption = description;

    if (description.startsWith('<p>') && description.endsWith('</p>')) {
        modifiedDesciption = description.substring(3, description.length - 4);
    }

    const newResearch = new ResearchModel({
        title,
        authors: modifiedAuthors,
        pageType,
        publicationYear,
        summary,
        description: modifiedDesciption
    });

    await newResearch.save();

    const resources = await ResearchModel.find()
    res.render('researches', {
        posts: resources,
        new: true
    });
};