const country = require('../data/country');

module.exports.getLogin = (req, res) => {
  return res.render('login');
};

module.exports.getRegisterGeneralUser = (req, res) => {
  return res.render('register_GeneralUser', { country });
};

module.exports.getRegisterExpertUser = (req, res) => {
  return res.render('register_ExpertUser', { country });
};

module.exports.getRegisterOrganization = (req, res) => {
  return res.render('register_Organization', { country });
};

module.exports.getCreateNewPassword = (req, res) => {
  return res.render('createNewPassword');
};

module.exports.getVerifyMessage = (req, res) => {
  return res.render('verifyMessage');
};
