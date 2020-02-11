const InnovationModel = require('../models/innovations');
const { pagination } = require('./utils');

const LIMIT = 9;

exports.getInnovation = async(req, res) => {
    const data = await InnovationModel.findById(req.params.id);
    res.render('singleInnovations', { data });
};

exports.getInnovations = async(req, res) => {
    const page = +req.query.page || 1;
    const search = req.query.search;
    let searchKey = {};
    let baseUrl = req.baseUrl;
    if (search) {
        baseUrl += `?search=${search}&page=`;
        const searchOption = {
            $regex: search,
            $options: 'i'
        };
        searchKey = {
            $or: [
                { title: searchOption },
                { BriefDesciption: searchOption },
                { conflictOfInterest: searchOption },
                { financialSupport: searchOption },
                { Acknowlegement: searchOption },
                { references: searchOption },
                { authors: searchOption }
            ]
        };
    } else baseUrl += `?page=`;

    const data = await InnovationModel.find(searchKey)
        .limit(LIMIT)
        .skip(LIMIT * (page - 1));
    const totalItems = await InnovationModel.find(searchKey).countDocuments();
    return res.render('innovations', {
        data,
        search,
        ...pagination(page, LIMIT, totalItems, baseUrl)
    });
};

exports.getNewInnovations = (req, res) => res.render('createInnovations');

exports.postInnovations = async(req, res) => {
    const {
        title,
        BriefDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    } = req.body;

    let modifiedDesciption = (x = BriefDesciption);

    if (x.startsWith('<p>') && x.endsWith('</p>')) {
        modifiedDesciption = x.substring(3, x.length - 4);
    }

    const newInnovations = new InnovationModel({
        title,
        BriefDesciption: modifiedDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    });

    await newInnovations.save();
    res.redirect('/innovations');
};