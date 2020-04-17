const admin = {
  id: 'admin123',
  name: 'admin',
  email: 'manager@trin-innovation.com',
  password: 'trin123admin@',
};

exports.adminAccess = (req, res, next) => {
  if (
    req.user &&
    req.user.email === admin.email &&
    req.user.password === admin.password
  ) {
    next();
  } else {
    return res.send('No Access Persmission');
  }
};

exports.canNotBeAuthenticated = (req, res, next) => {
  if (req.user) {
    return res.send('No Access Persmission');
  } else {
    next();
  }
};
