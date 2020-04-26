const { contactUsModel } = require('../models/contactUs');

exports.getContactUsPage = (req, res, next) =>
    res.render('contactUs', {
        user: req.user,
    });
exports.postContactUsPage = async(req, res, next) => {
    try {
        const newMessage = new contactUsModel(req.body);
        console.log(newMessage);
        await newMessage.save();
        req.flash('successMessage', 'Thanks for contacting us');
        return res.redirect('back');
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};