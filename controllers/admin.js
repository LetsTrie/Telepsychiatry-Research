const { contactUsModel } = require('../models/contactUs');
const { pagination } = require('./utils');

const LIMIT = 9;

exports.contactUs = async (req, res, next) => {
  const page = +req.query.page || 1;
  const data = await contactUsModel
    .find()
    .limit(LIMIT)
    .skip(LIMIT * (page - 1))
    .sort({ _id: -1 });
  const totalItems = await contactUsModel.find().countDocuments();
  return res.render('adminContactUs', {
    data,
    ...pagination(page, LIMIT, totalItems, '/admin/contactUs?page=')
  });
};
