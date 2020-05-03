const InnovationModel = require('../models/innovations');
const { pagination } = require('./utils');

const LIMIT = 9;

const { makeSmallParagraphFromHTML } = require('./utils');

exports.getInnovation = async(req, res) => {
    const data = await InnovationModel.findById(req.params.id);
    res.render('singleInnovations', { data, user: req.user });
};

exports.getInnovations = async(req, res) => {
    let { stage, searchInput, type } = req.query;
    let data;
    // console.log(searchInput);
    if (searchInput) {
        const keyword = {
            innovationStage: type,
            isVerified: true,
        };
        searchInput = searchInput.trim();
        let searchOptions = {
            $regex: searchInput,
            $options: 'i',
        };
        let searchKey = {
            $or: [
                { title: searchOptions },
                { description: searchOptions },
                { name: searchOptions },
                { designation: searchOptions },
                { email: searchOptions },
                { phone: searchOptions },
                { collaboration: searchOptions },
                { collabScope: searchOptions },
                { newsAndPub: searchOptions },
            ],
        };
        data = await InnovationModel.find({
            $and: [keyword, searchKey],
        });
        console.log(type);
        if (type == 'ongoing') {
            res.render('ongoingInnovations', { data, search: null });
        } else {
            res.render('completeInnovations', { data, search: null });
        }
    }
    data = await InnovationModel.find({
        innovationStage: stage,
        isVerified: true,
    });
    if (stage == 'ongoing') {
        res.render('ongoingInnovations', { data, search: null });
    } else {
        res.render('completeInnovations', { data, search: null });
    }
};

exports.getNewInnovations = (req, res) =>
    res.render('createInnovations', { user: req.user });

exports.postInnovations = async(req, res) => {
    const newInnovations = new InnovationModel({...req.body });
    await newInnovations.save();
    return res.redirect('/innovations');
};