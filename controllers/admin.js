const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');
const { ResearchModel } = require('../models/researches');
const InnovationModel = require('../models/innovations');
const { addDoctorModel } = require('../models/admin_addDoctor');
const { addDoctorValidation } = require('../validations/admin_addDoctor');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { makeSmallParagraphFromHTML } = require('./utils');
const { testModel } = require('../models/test');

const LIMIT = 9;

// ################## OKAY [START] ########################
// makes First letter Capital...
const trnsfrm = (x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();

const admin = require('../config/credentials').adminCredentials;
exports.getDashboard = (req, res, next) => res.render('admin_dashboard');
exports.getLogin = (req, res, next) => res.render('adminLogin');
exports.postLogin = (req, res, next) => {
    if (req.body.email == admin.email && req.body.password === admin.password) {
        passport.authenticate('local', {
            successRedirect: '/admin/',
            failureRedirect: '/admin/login',
            failureFlash: true,
        })(req, res, next);
    } else {
        return res.json({
            gotError: true,
            message: 'Incorrect Email or Password',
        });
    }
};

exports.getSingleTest = async(req, res) => {
    let test = await testModel.findById(req.params.id);
    let { lang } = req.query;
    if (nullChk(lang)) lang = 'eng';
    let data = {};
    if (lang === 'eng') {
        data['testName'] = test.testEng;
        data['disorderName'] = test.nameEng;
        data['ageRange'] = test.age;
        data['paidInput'] = test.paidInput;
        data['payAmount'] = test.payAmount;
        data['questions'] = [];
        for (let i = 0; i < test.questions.length; i++) {
            let obj = {};
            obj['QuesName'] = test.questions[i].questionEng;
            let arr = [];
            for (let j = 0; j < test.questions[i].Options.length; j++) {
                arr.push({
                    optionName: test.questions[i].Options[j].optionEng,
                    optionScale: test.questions[i].Options[j].scale,
                });
            }
            obj['options'] = arr;
            data['questions'].push(obj);
        }
    } else {
        data['testName'] = test.testBan;
        data['disorderName'] = test.nameBan;
        data['ageRange'] = test.age;
        data['paidInput'] = test.paidInput;
        data['payAmount'] = test.payAmount;
        data['questions'] = [];
        for (let i = 0; i < test.questions.length; i++) {
            let obj = {};
            obj['QuesName'] = test.questions[i].questionBan;
            let arr = [];

            for (let j = 0; j < test.questions[i].Options.length; j++) {
                arr.push({
                    optionName: test.questions[i].Options[j].optionBan,
                    optionScale: test.questions[i].Options[j].scale,
                });
            }

            obj['options'] = arr;
            console.log(obj['options']);
            data['questions'].push(obj);
        }
    }
    data['_id'] = test._id;
    res.render('singleTest', { test: data, lang });
};

function nullChk(data) {
    return data === undefined || data === null || data === '';
}
exports.updateTest = async(req, res) => {
    const test = await testModel.findById(req.params.id);
    res.render('updateTest', { test });
};

// ################## OKAY [THE END] ########################

exports.findTestbyDisorder = async(req, res) => {
    const { value } = req.body;
    const tests = await testModel.find({ nameEng: value });
    const arr = [];
    for (let i = 0; i < tests.length; i++) arr.push(tests[i].testEng);
    return res.json({ test: arr });
};

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item).toLowerCase();
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

exports.getAllTests = async(req, res, next) => {
    let searchKey = {};
    const { disorder, test, paid } = req.query;
    if (!nullChk(disorder)) searchKey['nameEng'] = disorder;
    if (!nullChk(test)) searchKey['testEng'] = test;
    if (!nullChk(paid)) searchKey['paidInput'] = paid;

    let tests = await testModel.find(searchKey);
    let AllTestForSearch = await testModel.find();

    let fs_disorders = new Set();
    for (let i = 0; i < AllTestForSearch.length; i++)
        fs_disorders.add(
            trnsfrm(AllTestForSearch[i].disorderNameEng.toLowerCase())
        );
    fs_disorders = Array.from(fs_disorders);

    let disorders = new Set();
    for (let i = 0; i < tests.length; i++)
        disorders.add(tests[i].disorderNameEng);
    disorders = Array.from(disorders);

    const groupedTests = groupBy(tests, (tests) => tests.disorderNameEng);

    let final = [];
    for (let i = 0; i < disorders.length; i++) {
        let disorderName = disorders[i];
        let relatedTests = [];
        let testMap = groupedTests.get(disorderName.toLowerCase());
        for (let j = 0; j < testMap.length; j++) relatedTests.push(testMap[j]);
        final.push({ disorderName, relatedTests });
    }
    // console.log(final);
    return res.render('admin__test', {
        tests: final,
        searchDisorder: fs_disorders,
    });
};

exports.postUpdateTest = async(req, res) => {
    const id = req.body.id;
    const Questions = JSON.parse(req.body.questions);
    await testModel.update({ _id: id }, {
        $set: {
            testEng: req.body.testEng,
            testBan: req.body.testBan,
            nameEng: trnsfrm(req.body.nameEng),
            nameBan: req.body.nameBan,
            age: req.body.age,
            paidInput: req.body.paidInput,
            payAmount: req.body.payAmount,
            questions: Questions,
        },
    });

    res.send({
        staus: true,
        msg: 'okay',
    });
};

exports.createTest = async(req, res, next) => {
    console.log(req.body);
    let {
        testEng,
        testBan,
        disorderNameEng,
        disorderNameBan,
        age,
        isPaid,
        payAmount,
    } = req.body;
    const languages = JSON.parse(req.body.languages);
    const questionSet = JSON.parse(req.body.questionSet);
    const test = {
        testEng,
        testBan,
        disorderNameEng: trnsfrm(disorderNameBan),
        disorderNameBan,
        age,
        isPaid,
        payAmount,
        languages,
        questionSet,
    };
    const { validateTestData } = require('../validations/test');
    const { error } = validateTestData(test);
    if (error) {
        console.log(error);
        return res.send({ status: false, msg: error.details[0].message });
    }
    const newTest = new testModel(test);
    await newTest.save();
    return res.send({ status: true, msg: 'okay', id: newTest._id });
};

exports.contactUs = async(req, res, next) => {
    checker(req, res);
    const page = +req.query.page || 1;
    const data = await contactUsModel
        .find()
        .limit(LIMIT)
        .skip(LIMIT * (page - 1))
        .sort({ _id: -1 });
    const totalItems = await contactUsModel.find().countDocuments();
    return res.render('adminContactUs', {
        data,
        ...pagination(page, LIMIT, totalItems, '/admin/contactUs?page='),
    });
};

exports.adminGetResearch = async(req, res) => {
    checker(req, res);
    const page = +req.query.page || 1;
    const search = req.query.search;
    let searchKey = { isVerified: false };
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
                { isVerified: false },
            ],
        };
    } else baseUrl += `?page=`;

    const data = await ResearchModel.find(searchKey)
        .limit(LIMIT)
        .skip(LIMIT * (page - 1));
    const totalItems = await ResearchModel.find(searchKey).countDocuments();
    return res.render('adminResearch', {
        data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
        search,
        ...pagination(page, LIMIT, totalItems, baseUrl),
    });
};

exports.getResearch = async(req, res) => {
    checker(req, res);
    const data = await ResearchModel.findById(req.params.id);
    res.render('adminSingleResearch', { data });
};

exports.approveResearch = async(req, res) => {
    checker(req, res);
    const id = req.params.id;
    ResearchModel.updateOne({ _id: id }, { $set: { isVerified: true } },
        (err, docs) => {
            res.redirect('/admin/get_research');
        }
    );
};

exports.disapproveResearch = async(req, res) => {
    checker(req, res);
    const id = req.params.id;
    ResearchModel.updateOne({ _id: id }, { $set: { isVerified: false } },
        (err, docs) => {
            res.redirect('/admin/get_research');
        }
    );
};

exports.getInnovations = async(req, res) => {
    checker(req, res);
    const page = +req.query.page || 1;
    const search = req.query.search;
    let searchKey = { isVerified: false };
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
                { isVerified: false },
            ],
        };
    } else baseUrl += `?page=`;

    const data = await InnovationModel.find(searchKey)
        .limit(LIMIT)
        .skip(LIMIT * (page - 1));
    const totalItems = await InnovationModel.find(searchKey).countDocuments();
    return res.render('adminInnovations', {
        data: makeSmallParagraphFromHTML(data, 'BriefDesciption'),
        search,
        ...pagination(page, LIMIT, totalItems, baseUrl),
    });
};

exports.singleInnoavtion = async(req, res) => {
    checker(req, res);
    const data = await InnovationModel.findById(req.params.id);
    res.render('adminSingleInnovation', { data });
};

exports.approveInnovation = async(req, res) => {
    checker(req, res);
    const id = req.params.id;
    InnovationModel.updateOne({ _id: id }, { $set: { isVerified: true } },
        (err, docs) => {
            res.redirect('/admin/get_innovation');
        }
    );
};

exports.disapproveInnovation = async(req, res) => {
    checker(req, res);
    const id = req.params.id;
    InnovationModel.updateOne({ _id: id }, { $set: { isVerified: false } },
        (err, docs) => {
            res.redirect('/admin/get_innovation');
        }
    );
};

const APM = (data) => (data === 'AM' ? 1 : 0);
const revAPM = (data) => (data ? 'AM' : 'PM');
const makeNumberLengthTwo = (data) => {
    let x = data.toString();
    return x.length === 2 ? x : `0${x}`;
};

const createTimeString = (frm, two) => {
    checker(req, res);
    return `${makeNumberLengthTwo(frm.from)}:00 ${revAPM(
    frm.APM
  )} - ${makeNumberLengthTwo(two.to)}:00 ${revAPM(two.APM)}`;
};

const getScheduleArray = (visitingTime) => {
    checker(req, res);
    const schedules = [];
    for (let i = 0; i < visitingTime.length; i++) {
        let frm = visitingTime[i].from;
        let two = visitingTime[i].to;
        let fromStart = parseInt(frm.split(':')[0]);
        let toEnd = parseInt(two.split(':')[0]);
        let fromAPM = APM(frm.split(' ')[1]);
        let toAPM = APM(two.split(' ')[1]);
        if (fromAPM === toAPM) {
            if (fromStart > toEnd) {
                return res.status(400).json({ success: false });
            }
        }
        while (fromStart !== toEnd || fromAPM !== toAPM) {
            schedules.push({ from: fromStart, APM: fromAPM });
            fromStart++;
            if (fromStart > 12) fromStart %= 12;
            if (fromStart === 12) fromAPM ^= 1;
            schedules.push({ to: fromStart, APM: fromAPM });
        }
    }
    const schedule = [];
    for (let i = 0; i < schedules.length; i += 2) {
        schedule.push(createTimeString(schedules[i], schedules[i + 1]));
    }
    return schedule;
};

exports.addDoctor = async(req, res, next) => {
    checker(req, res);
    const { error } = addDoctorValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { visitingTime } = req.body;
    const schedules = getScheduleArray(visitingTime);
    const doc = new addDoctorModel({
        ...req.body,
        visitingTime: schedules,
    });
    await doc.save();
    return res.json({ success: true, doc });
};

module.exports.postAddDoctor = async(req, res) => {
    checker(req, res);
    const {
        name,
        gender,
        institute,
        expertise,
        designation,
        aboutYourself,
        email,
        speciality,
        dob,
        fee,
    } = req.body;
    const education = JSON.parse(req.body.education);
    const services = JSON.parse(req.body.services);
    const workExperience = JSON.parse(req.body.workExperience);
    const visitingHour = JSON.parse(req.body.visitingHour);

    console.log(req.body);
};

module.exports.replyEmail = (req, res) => {
    checker(req, res);
    const reply = req.body.reply;
    const emailID = req.body.emailID;
    const id = req.body.id;
    // sendReply(emailID, reply)
    contactUsModel.updateOne({ _id: id }, { $set: { isReplied: true } },
        (err, docs) => {
            req.flash('successMessage', 'ok');
            res.redirect('back');
        }
    );
};

function sendReply(emailID, reply) {
    var Transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'safwan.du16@gmail.com',
            pass: '',
        },
    });

    var mailOptions;
    let sender = "'/'";
    mailOptions = {
        from: sender,
        to: 'safwan.du16@gmail.com',
        subject: 'Reply from TRIN',
        html: reply,
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent');
        }
    });
}

// ################## Utils #######################

async function checker(req, res) {
    if (req.user) {
        const logged = JSON.stringify(admin) == JSON.stringify(req.user);
        if (!logged) {
            return res.redirect('/admin/login');
        }
    } else {
        return res.redirect('/admin/login');
    }
}