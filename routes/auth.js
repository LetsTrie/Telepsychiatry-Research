const router = require('express').Router();

const {
    getRegisterGeneralUser,
    getRegisterExpertUser,
    getRegisterOrganizations,
    postRegisterGeneralUser,
    postRegisterExpertUserData,
    postRegisterExpertUserFile,
    postRegisterOrgUser,
    postCheckDuplication,
    eUserCheckDuplication,
    postLogin,
    expProfile,
    verifyAccount,
    mail,
} = require('../controllers/auth');

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename + '-' + file.originalname;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadPhoto = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
}).single('exp_user_propic');

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
router.post('/register/new/exp/file', uploadPhoto, postRegisterExpertUserFile);
router.post('/register/new/exp/data', postRegisterExpertUserData);

router.get('/register/new/org', getRegisterOrganizations);
router.post('/register/new/org', postRegisterOrgUser);

router.get('/user/profile/:id', expProfile);
router.get('/verify/:id', verifyAccount);
router.get('/mail', mail);
module.exports = router;