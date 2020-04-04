const router = require('express').Router();

const {
    getRegisterGeneralUser,
    getRegisterExpertUser,
    getRegisterOrganizations,
    postRegisterGeneralUser,
    postRegisterExpertUser,
    postRegisterExpertUser_New,
    postRegisterOrgUser,
    postCheckDuplication
} = require('../controllers/auth');

router.get('/login', (req, res, next) => res.render('login'));

router.get('/register/new/gen', getRegisterGeneralUser);
router.post('/register/new/gen', postRegisterGeneralUser);
router.post('/register/checkDuplicate', postCheckDuplication);

router.get('/register/new/exp', getRegisterExpertUser);
router.post('/register/new/exp', postRegisterExpertUser_New);

router.get('/register/new/org', getRegisterOrganizations);
router.post('/register/new/org', postRegisterOrgUser);

module.exports = router;