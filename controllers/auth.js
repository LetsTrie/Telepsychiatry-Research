const country = require('../data/country');
const multer = require('multer')
const path = require('path')
const { gUserModel } = require('../models/generalUser')
const { eUserModel } = require('../models/expertUser')
const { orgUserModel } = require('../models/orgUser')
const joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')

exports.getRegisterGeneralUser = (req, res, next) => {
    return res.render('register_gen', { country });
};
exports.getRegisterExpertUser = (req, res, next) => {
    return res.render('register_exp', { country });
};

exports.getRegisterOrganizations = (req, res, next) => {
    return res.render('register_org', { country });
};

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, 'gen_user' + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

exports.postRegisterGeneralUser = async(req, res, next) => {

    const {
        fname,
        lname,
        email,
        password,
        phoneNumber,
        gender,
        country,
        dob,
        cAffiliation,
        hADegree
    } = req.body
    console.log(req)
    try {
        await joi.object().keys({
            fname: joi.string().required().regex(/^[a-zA-Z ]+$/),
            lname: joi.string().required().regex(/^[a-zA-Z ]+$/),
            email: joi.string().required().regex(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
            password: joi.string().required().min(6),
            phoneNumber: joi.string().required().regex(/\w+/i).min(6),
            gender: joi.string().required(),
            country: joi.string().required(),
            dob: joi.string().required().regex(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
            cAffiliation: joi.string().required(),
            hADegree: joi.string().required()
        }).validate(req.body)

        bcrypt.genSalt(10, async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                const newGenUser = await new gUserModel({
                    fname,
                    lname,
                    email,
                    password: hash,
                    phoneNumber,
                    gender,
                    country,
                    dob,
                    cAffiliation,
                    hADegree
                }).save()
                console.log('gen user saved')
                res.redirect('/')
            });
        });
    } catch (err) {
        console.log(err)
    }
}

exports.genUserSaveImage = async(req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        } else {
            if (req.file == undefined) {
                console.log('file not selected')
                res.redirect('back')
            } else {
                res.redirect('back')
            }
        }
    });
}

exports.postRegisterExpertUser = async(req, res, next) => {

    const {
        fname,
        lname,
        email,
        password,
        phoneNumber,
        gender,
        country,
        dob,
        cAffiliation,
        identifyNo,
        researchArea,
        hADegree
    } = req.body
    try {
        await joi.object().keys({
            fname: joi.string().required().regex(/^[a-zA-Z ]+$/),
            lname: joi.string().required().regex(/^[a-zA-Z ]+$/),
            email: joi.string().required().regex(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
            password: joi.string().required().min(6),
            phoneNumber: joi.string().required().regex(/\w+/i).min(6),
            gender: joi.string().required(),
            country: joi.string().required(),
            dob: joi.string().required().regex(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
            cAffiliation: joi.string().required(),
            identifyNo: joi.string().required(),
            researchArea: joi.string().required(),
            hADegree: joi.string().required()
        }).validate(req.body)

        bcrypt.genSalt(10, async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                const newExpUser = await new eUserModel({
                    fname,
                    lname,
                    email,
                    password: hash,
                    phoneNumber,
                    gender,
                    country,
                    dob,
                    identifyNo,
                    researchArea,
                    cAffiliation,
                    hADegree
                }).save()
                console.log('exp user saved')
                res.redirect('/')
            });
        });
    } catch (err) {
        console.log(err)
    }
}

exports.postRegisterOrgUser = async(req, res, next) => {

    const {
        name,
        authName,
        authPhoneNumber,
        authEmail,
        region,
        org_type,
        password,
        establish_year,
        websiteLink
    } = req.body
    console.log(req.body)
    try {
        await joi.object().keys({
            name: joi.string().required(),
            authName: joi.string().required().regex(/^[a-zA-Z ]+$/),
            authEmail: joi.string().required().regex(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
            password: joi.string().required().min(6),
            authPhoneNumber: joi.string().required().regex(/\w+/i).min(6),
            region: joi.string().required(),
            org_type: joi.string().required(),
            websiteLink: joi.string().required(),
            establish_year: joi.string().required()
        }).validate(req.body)

        bcrypt.genSalt(10, async function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                const newOrgUser = await new orgUserModel({
                    name,
                    authName,
                    authPhoneNumber,
                    authEmail,
                    region,
                    org_type,
                    password,
                    establish_year,
                    websiteLink
                }).save()
                console.log('org user saved')
                res.redirect('/')
            });
        });
    } catch (err) {
        console.log(err)
    }
}