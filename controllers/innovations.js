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
            res.render('ongoingInnovations', {
                data,
                search: null,
                user: req.user,
            });
        } else {
            res.render('completeInnovations', {
                data,
                search: null,
                user: req.user,
            });
        }
    }
    data = await InnovationModel.find({
        innovationStage: stage,
        isVerified: true,
    });
    if (stage == 'ongoing') {
        res.render('ongoingInnovations', {
            data,
            search: null,
            user: req.user,
        });
    } else {
        res.render('completeInnovations', {
            data,
            search: null,
            user: req.user,
        });
    }
};

exports.getNewInnovations = (req, res) =>
    res.render('createInnovations', { user: req.user });

exports.innovationFile = async(req, res) => {
    console.log('innovations file saved');
    res.redirect(`/innovations?stage=ongoing`);
};
exports.postInnovations = async(req, res) => {
    if (!req.user) {
        res.send('User not found');
    }
    const { validateInnovationData } = require('../validations/innovations');
    const { error } = validateInnovationData(req.body);
    if (error) {
        console.log(error);
        res.send({
            status: false,
            msg: 'error',
        });
    }
    const newInn = new InnovationModel({
        ...req.body,
        description: makeSmallParagraphFromHTML([req.body], 'description')[0]
            .description,
        authorID: req.user._id,
        isVerified: false,
    });
    console.log(newInn);
    await newInn.save();
    res.send({
        status: true,
        msg: newInn._id,
    });
};

const path = require('path');
exports.downloadFile = async(req, res) => {
    const filePath = path.join(
        process.cwd(),
        '/public',
        '/innovation',
        req.params.id
    );
    res.download(filePath);
};

exports.getUpdate = async(req, res) => {
    const data = await InnovationModel.findById(req.params.id);
    res.render('updateInnovationsOthers', {
        data,
        user: req.user,
    });
};

exports.postUpdate = async(req, res) => {
    const {
        id,
        title,
        description,
        name,
        designation,
        email,
        phone,
        collaboration,
        collabScope,
        financialSupport,
        newsAndPub,
        innovationStage,
        link,
    } = req.body;

    await InnovationModel.findOneAndUpdate({ _id: id }, {
        $set: {
            title: title,
            description: description,
            name: name,
            designation: designation,
            email: email,
            phone: phone,
            collaboration: collaboration,
            collabScope: collabScope,
            financialSupport: financialSupport,
            newsAndPub: newsAndPub,
            innovationStage: innovationStage,
            link: link,
        },
    });
    res.send({
        status: true,
        msg: 'okke',
    });
};