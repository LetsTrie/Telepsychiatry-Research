const country = require('../data/country');

exports.getRegisterGeneralUser = (req, res, next) => {
  return res.render('register_gen', { country });
};
exports.getRegisterExpertUser = (req, res, next) => {
  return res.render('register_exp', { country });
};

exports.getRegisterOrganizations = (req, res, next) => {
  return res.render('register_org', { country });
};
