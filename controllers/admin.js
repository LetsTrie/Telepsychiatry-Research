const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');
const { ResearchModel } = require('../models/researches');
const InnovationModel = require('../models/innovations');
const { addDoctorModel } = require('../models/admin_addDoctor');
const { addDoctorValidation } = require('../validations/admin_addDoctor');
const passport = require('passport');
const { makeSmallParagraphFromHTML } = require('./utils');
const { testModel } = require('../models/test');
const admin = require('../config/credentials').adminCredentials;

const LIMIT = 9;

exports.postTestVersion = async(req, res, next) => {
    const { id } = req.body;
    const qItem = JSON.parse(req.body.qItem);
    const newLanguage = JSON.parse(req.body.languages)[0];
    const test = await testModel.find({ _id: id });

    let QuestionSet = test[0].questionSet;
    QuestionSet.push(qItem);
    let languages = test[0].language;
    languages.push(newLanguage);

    await testModel.findOneAndUpdate({ _id: id }, {
        $set: {
            questionSet: QuestionSet,
            language: languages,
        },
    });

    res.send({
        status: true,
        id: id,
    });
};

exports.postUpdateTest = async(req, res) => {
    const { id, qLang } = req.body;
    let QuestionSet = JSON.parse(req.body.questionSet)[0];
    const test = await testModel.findById(id);
    for (let i = 0; i < test.questionSet.length; i++) {
        if (test.questionSet[i].language == qLang) {
            test.questionSet.splice(i, 1);
        }
    }
    test.questionSet.push({
        Questions: QuestionSet.Questions,
        language: QuestionSet.language,
    });
    await testModel.update({ _id: id }, {
        $set: {
            testEng: req.body.testEng,
            testBan: req.body.testBan,
            disorderNameEng: trnsfrm(req.body.disorderNameEng),
            disorderNameBan: req.body.disorderNameBan,
            age: req.body.age,
            isPaid: req.body.isPaid,
            payAmount: req.body.payAmount,
            questionSet: test.questionSet,
        },
    });

    res.send({
        status: true,
        msg: 'okay',
    });
};

// ############## OKAY ####################

/*
  @method : GET
  @route  : /admin/
  @auth   : Private [Admin]
  @desc   : Admin Dashboard
*/

exports.getDashboard = (req, res, next) =>
    res.render('admin_dashboard', {
        user: req.user,
    });

/*
  @method : GET
  @route  : /admin/login
  @auth   : Public
  @desc   : Login
*/

exports.getLogin = (req, res, next) =>
    res.render('adminLogin', {
        user: req.user,
    });

/*
  @method : POST
  @route  : /admin/login
  @auth   : Public
  @desc   : Login
*/

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

/*
  @method : POST
  @route  : /admin/test/new
  @auth   : Private [Admin]
  @desc   : Add Test
*/

exports.createTest = async(req, res, next) => {
    let {
        testEng,
        testBan,
        disorderNameEng,
        disorderNameBan,
        age,
        isPaid,
        payAmount,
    } = req.body;
    const language = JSON.parse(req.body.languages);
    const questionSet = JSON.parse(req.body.questionSet);
    const test = {
        testEng,
        testBan,
        disorderNameEng: trnsfrm(disorderNameEng),
        disorderNameBan,
        age,
        isPaid,
        payAmount,
        language,
        questionSet,
    };
    const { validateTestData } = require('../validations/test');
    const { error } = validateTestData(test);
    if (error) return res.send({ status: false, msg: error.details[0].message });
    const newTest = new testModel(test);
    await newTest.save();
    return res.send({
        status: true,
        msg: 'okay',
        id: newTest._id,
        lang: test.language[0],
    });
};

/*
  @method : GET
  @route  : /admin/tests
  @auth   : Private [Admin]
  @desc   : Show All Disorders with distinct Test name
*/

exports.getAllTests = async(req, res, next) => {
    let searchKey = {};
    const { disorder, test, paid } = req.query;
    if (!nullChk(disorder)) searchKey['disorderNameEng'] = disorder;
    if (!nullChk(test)) searchKey['testEng'] = test;
    if (!nullChk(paid)) searchKey['isPaid'] = paid;

    let tests = await testModel.find(searchKey);

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
        for (let j = 0; j < testMap.length; j++) {
            const langLen = testMap[j].language.length;
            let language = langLen == 1 ? testMap[j].language[0] : 'English';
            relatedTests.push({ test: testMap[j], language });
        }
        final.push({ disorderName, relatedTests });
    }

    // ########### Search Disorder (All names) ###########
    let AllTestForSearch = await testModel.find();
    let fs_disorders = new Set();
    for (let i = 0; i < AllTestForSearch.length; i++)
        fs_disorders.add(
            trnsfrm(AllTestForSearch[i].disorderNameEng.toLowerCase())
        );
    fs_disorders = Array.from(fs_disorders);
    // ###################################################

    return res.render('admin__test', {
        tests: final,
        searchDisorder: fs_disorders,
        user: req.user,
    });
};

/*
  @method : GET
  @route  : /admin/test/single/:id?lang=
  @auth   : Private [Admin]
  @desc   : Show a single test
*/

exports.getSingleTest = async(req, res) => {
    let testData = await testModel.findById(req.params.id);
    let { lang } = req.query;
    if (nullChk(lang)) {
        const langLen = testData.language.length;
        lang = langLen === 1 ? testData.language[0] : 'English';
    }
    const test = await getTestData(testData, lang);
    console.log(test);
    res.render('singleTest', { test, lang, user: req.user });
};

/*
  @method : GET
  @route  : /admin/test/update/:id?lang=
  @auth   : Private [Admin]
  @desc   : Update a test of a language
*/

exports.updateTest = async(req, res) => {
    let test = await testModel.findById(req.params.id);
    let { lang } = req.query;
    if (nullChk(lang)) {
        const langLen = test.language.length;
        lang = langLen === 1 ? test.language[0] : 'English';
    }
    const questionData = await getTestData(test, lang);
    res.render('updateTest', { test, questionData, lang, user: req.user });
};

/*
  @method : POST
  @route  : /admin/findTestbyDisorder
  @auth   : Private [Admin]
  @desc   : Find Test by Disorder
*/

exports.findTestbyDisorder = async(req, res) => {
    const { value } = req.body;
    const tests = await testModel.find({ disorderNameEng: value });
    return res.json({
        test: tests.map((x) => x.testEng),
    });
};

/*
  @method : GET
  @route  : /admin/test/version/:id?alt=
  @auth   : Private [Admin]
  @desc   : Insert new (language) version of a test...
*/

exports.addTestVersion = async(req, res, next) => {
    let { alt } = req.query;
    if (alt === 'English') alt = 'Bengali';
    else alt = 'English';
    const test = await testModel.findById(req.params.id);
    return res.render('addTestVersion', { test, version: alt, user: req.user });
};

async function getTestData(test, lang) {
    let data = {};
    data['_id'] = test._id;
    data['testName'] = lang === 'English' ? test.testEng : test.testBan;
    data['disorderName'] =
        lang === 'English' ? test.disorderNameEng : test.disorderNameBan;
    data['ageRange'] = test.age;
    data['paidInput'] = test.isPaid;
    data['payAmount'] = test.payAmount;
    data['language'] = test.language;
    data['questions'] = [];

    let questions = [];
    for (let i = 0; i < test.questionSet.length; i++) {
        if (test.questionSet[i].language == lang) {
            questions = test.questionSet[i].Questions;
            break;
        }
    }
    for (let i = 0; i < questions.length; i++) {
        let obj = {};
        obj['QuesName'] = questions[i].question;
        obj['QuesScale'] = questions[i].scale;
        obj['options'] = [];
        for (let j = 0; j < questions[i].Options.length; j++) {
            obj['options'].push({
                optionName: questions[i].Options[j].option,
                optionScale: questions[i].Options[j].scale,
            });
        }
        data['questions'].push(obj);
    }
    return data;
}

// ################## Utils #######################

function trnsfrm(x) {
    return x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();
}

function nullChk(data) {
    return data === undefined || data === null || data === '';
}

function checker(req, res) {
    if (req.user) {
        const logged = JSON.stringify(admin) == JSON.stringify(req.user);
        if (!logged) {
            return res.redirect('/admin/login');
        }
    } else {
        return res.redirect('/admin/login');
    }
}

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

// ####################### Extra Part #######################
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
        user: req.user,
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
        user: req.user,
        ...pagination(page, LIMIT, totalItems, baseUrl),
    });
};

exports.getResearch = async(req, res) => {
    checker(req, res);
    const data = await ResearchModel.findById(req.params.id);
    res.render('adminSingleResearch', { data, user: req.user });
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
        user: req.user,
        ...pagination(page, LIMIT, totalItems, baseUrl),
    });
};

exports.singleInnoavtion = async(req, res) => {
    checker(req, res);
    const data = await InnovationModel.findById(req.params.id);
    res.render('adminSingleInnovation', { data, user: req.user });
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