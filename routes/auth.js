const router = require('express').Router();

const {
    getRegisterGeneralUser,
    getRegisterExpertUser,
    getRegisterOrganizations,
    postRegisterGeneralUser,
    postRegisterExpertUser,
    postRegisterOrgUser,
    postCheckDuplication,
    saveExpUser,
    eUserCheckDuplication,
    postLogin,
    expProfile,
} = require('../controllers/auth');

router.get('/login', (req, res, next) => res.render('login'));
router.post('/login', postLogin);
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/auth/login');
});

router.get('/register/new/gen', getRegisterGeneralUser);
router.post('/register/new/gen', postRegisterGeneralUser);
router.post('/register/checkDuplicate', postCheckDuplication);
router.post('/register/eUserCheckDuplicate', eUserCheckDuplication);

router.get('/register/new/exp', getRegisterExpertUser);
router.post('/register/new/exp', postRegisterExpertUser);
router.post('/register/new/exp/save', saveExpUser);

router.get('/register/new/org', getRegisterOrganizations);
router.post('/register/new/org', postRegisterOrgUser);

router.get('/expert/profile/:id', expProfile);
module.exports = router;