const { contactUsModel } = require('../models/contactUs')

exports.contactUs = async(req, res, next) => {
    const msg = await contactUsModel.find()
    res.render('adminContactUs', {
        message: msg
    });
};