// OKAY
const admin = require('../config/credentials').adminCredentials;

exports.adminAccess = (req, res, next) => {
  if (
    req.user &&
    req.user.email === admin.email &&
    req.user.password === admin.password
  ) {
    next();
  } else {
    return res.redirect('/admin/login');
  }
};

exports.privateRoute = (req, res, next) => {
  if (req.user) next();
  else res.redirect('/auth/login');
};

exports.canNotBeAuthenticated = (req, res, next) => {
  if (req.user) {
    return res.send('No Access Persmission');
  } else {
    next();
  }
};
