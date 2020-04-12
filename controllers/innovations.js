const InnovationModel = require('../models/innovations');
const { pagination } = require('./utils');

const LIMIT = 9;

const { makeSmallParagraphFromHTML } = require('./utils');

exports.getInnovation = async(req, res) => {
    const data = await InnovationModel.findById(req.params.id);
    res.render('singleInnovations', { data });
};

exports.getInnovations = async(req, res) => {
    const page = +req.query.page || 1;
    const search = req.query.search;
    let searchKey 
    // = { isVerified: true };
    let baseUrl = req.baseUrl;
    if (search) {
        baseUrl += `?search=${search}&page=`;
        const searchOption = {
            $regex: search,
            $options: 'i',
        };
        searchKey = {
            $or: [
                { title: searchOption },
                { BriefDesciption: searchOption },
                { conflictOfInterest: searchOption },
                { financialSupport: searchOption },
                { Acknowlegement: searchOption },
                { references: searchOption },
                { authors: searchOption },
            ],
        };
    } else baseUrl += `?page=`;

    const data = await InnovationModel.find(searchKey)
        .limit(LIMIT)
        .skip(LIMIT * (page - 1));
    const totalItems = await InnovationModel.find(searchKey).countDocuments();

    return res.render('innovations', {
        data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
        search,
        ...pagination(page, LIMIT, totalItems, baseUrl),
    });
};

exports.getNewInnovations = (req, res) => res.render('createInnovations');

exports.postInnovations = async(req, res) => {
    const newInnovations = new InnovationModel({...req.body });
    await newInnovations.save();
    return res.redirect('/innovations');
};