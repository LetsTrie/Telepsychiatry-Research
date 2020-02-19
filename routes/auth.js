const router = require('express').Router();

const {
    getRegisterGeneralUser,
    getRegisterExpertUser,
    getRegisterOrganizations,
    postRegisterGeneralUser,
    genUserSaveImage,
    postRegisterExpertUser,
    postRegisterOrgUser
} = require('../controllers/auth');

router.get('/login', (req, res, next) => res.render('login'));
router.get('/register/new/gen', getRegisterGeneralUser);
router.get('/register/new/exp', getRegisterExpertUser);
router.get('/register/new/org', getRegisterOrganizations);

router.post('/register/new/gen', postRegisterGeneralUser)
router.post('/register/new/gen/image', genUserSaveImage)
router.post('/register/new/exp', postRegisterExpertUser)
router.post('/register/new/org', postRegisterOrgUser)

module.exports = router;