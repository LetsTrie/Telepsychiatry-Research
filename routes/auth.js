const router = require('express').Router();

const {
  getRegisterGeneralUser,
  getRegisterExpertUser,
  getRegisterOrganizations
} = require('../controllers/auth');

router.get('/login', (req, res, next) => res.render('login'));
router.get('/register/new/gen', getRegisterGeneralUser);
router.get('/register/new/exp', getRegisterExpertUser);
router.get('/register/new/org', getRegisterOrganizations);

module.exports = router;
