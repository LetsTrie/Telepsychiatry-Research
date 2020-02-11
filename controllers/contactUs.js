const { contactUsModel } = require('../models/contactUs');

exports.getContactUsPage = (req, res, next) => res.render('contactUs');
exports.postContactUsPage = async(req, res, next) => {
  const {name, email, message} = req.body;

  const newMessage = new contactUsModel({
    name, email, message
  })

  // await newMessage.save();
  req.flash('successMessage', 'Thanks for contacting us');
  res.redirect('back')
}