const router = require('express').Router();

const {
    getLogin,
    contactUs,
    adminGetResearch,
    getResearch,
    approveResearch,
    disapproveResearch,
    getInnovations,
    singleInnoavtion,
    approveInnovation,
    disapproveInnovation,
    postAddDoctor,
    replyEmail,

    // tests
    getAllTests,
    newTest,
    postLogin,
    createTest,
    getSingleTest,
    updateTest,
    postUpdateTest,
    getDashboard,
    findTestbyDisorder,
    addTestVersion,
    postTestVersion,

    // researches
    getAdminResearches,
    getAdminResearch,
    getAdminNewResearch,
    postResearches,
    researchFile,
    getAllResearches,
    getAdminUpdateResearch,
    postAdminUpdateResearch,
    getUnverifiedResearches,

    // innovations
    postInnovation,
    innovationFile,
    getAdminInnovations,
    getAdminInnovation,
    getAdminUpdateInnovation,
    postAdminUpdateInnovation,
    getUnverifiedInnoations,

    // workshops
    postWorkshop,
    workshopFile,
    getWorkshop,
    singleWorkshop,
    getUpdateWorkshop,
    postUpdateWorkshop,
    deleteWorkshop,

    // special service
    getAdminNewSpecialService,
    postAdminNewSS,
    ssFile,
    getExperts,

    // backup
    getBackup,
} = require('../controllers/admin');

const {
    adminAccess,
    canNotBeAuthenticated,
} = require('../middlewares/authorization');

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/research/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename;
        cb(null, filename);
    },
});

const innovationStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('here');
        cb(null, 'public/innovation/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename;
        cb(null, filename);
    },
});

const workshopStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('here');
        cb(null, 'public/workshop/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename;
        cb(null, filename);
    },
});

const ssStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/specialService/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename;
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

const uploadResearchFile = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
}).single('researchFile');

const uploadInnovationFile = multer({
    storage: innovationStorage,
    fileFilter: fileFilter,
}).single('innovationFile');

const uploadPhotoWorkshop = multer({
    storage: workshopStorage,
    fileFilter: fileFilter,
}).single('workshopFile');

const uploadPhotoSS = multer({
    storage: ssStorage,
    fileFilter: fileFilter,
}).single('ssFile');

// OKAY
router.get('/', adminAccess, getDashboard);
router.get('/login', canNotBeAuthenticated, getLogin);
router.post('/login', canNotBeAuthenticated, postLogin);
router.get('/tests', adminAccess, getAllTests);
router.get('/test/new', adminAccess, (req, res, next) =>
    res.render('admin_test_new', newTest)
);
router.post('/test/new', adminAccess, createTest);
router.get('/test/single/:id', adminAccess, getSingleTest);
router.get('/test/update/:id', adminAccess, updateTest);
router.post('/test/update', adminAccess, postUpdateTest);
router.get('/test/version/:id', adminAccess, addTestVersion);
router.post('/test/version', adminAccess, postTestVersion);
router.get('/logout', adminAccess, (req, res, next) => {
    req.logout();
    res.redirect('/admin/login');
});
router.post('/findTestbyDisorder', adminAccess, findTestbyDisorder);

//admin contact us
router.get('/contactUs', contactUs);
router.post('/replyEmail', replyEmail);

//admin Add Doctors
router.get('/addDoctors', (req, res) => {
    res.render('addDoctors', { user: req.user });
});
router.post('/postAddDoctor', postAddDoctor);

//admin research
router.get('/get_research', adminGetResearch);
router.get('/single_research/:id', getResearch);
router.get('/research/approve/:id', approveResearch);
router.get('/research/disapprove/:id', disapproveResearch);

//admin innovation
router.get('/get_innovation', getInnovations);
router.get('/single_innovation/:id', singleInnoavtion);
router.get('/innovation/approve/:id', approveInnovation);
router.get('/innovation/disapprove/:id', disapproveInnovation);

//admin researches
router.get('/researches', adminAccess, getAdminResearches);
router.get('/research/:id', adminAccess, getAdminResearch);
router.get('/new/research', adminAccess, getAdminNewResearch);
router.post('/research/new', adminAccess, postResearches);
router.post(
    '/research/new/file',
    adminAccess,
    uploadResearchFile,
    researchFile
);
router.get('/research/update/:id', adminAccess, getAdminUpdateResearch);
router.post('/research/update', adminAccess, postAdminUpdateResearch);
router.get('/researches/unverified', adminAccess, getUnverifiedResearches);

// special services
router.get('/new/specialService', adminAccess, getAdminNewSpecialService);
router.post('/new/specialService', adminAccess, postAdminNewSS);
router.post('/new/specialService/file', [adminAccess, uploadPhotoSS], ssFile);
router.post('/new/specialService', adminAccess, postAdminNewSS);
router.get('/new/specialService/getExperts', adminAccess, getExperts)

// admin innovations
router.get('/innovation/new', adminAccess, (req, res) => {
    const { user } = req.user;
    return res.render('addInnovationFromAdmin', { user });
});
router.post('/innovation/new', adminAccess, postInnovation);
router.post(
    '/innovation/new/file', [adminAccess, uploadInnovationFile],
    innovationFile
);
router.get('/innovations', adminAccess, getAdminInnovations);
router.get('/innovation/:id', adminAccess, getAdminInnovation);
router.get('/innovation/update/:id', adminAccess, getAdminUpdateInnovation);
router.post('/innovation/update', adminAccess, postAdminUpdateInnovation);
router.get('/innovations/unverified', adminAccess, getUnverifiedInnoations);

// admin workshop
router.get('/workshop/new', (req, res) => {
    res.render('add-new-workshop');
});
router.post('/workshop/new', postWorkshop);
router.post(
    '/workshop/new/file', [adminAccess, uploadPhotoWorkshop],
    workshopFile
);
router.get('/workshop', adminAccess, getWorkshop);
router.get('/workshop/:id', adminAccess, singleWorkshop);
router.get('/workshop/update/:id', adminAccess, getUpdateWorkshop);
router.post('/workshop/update', adminAccess, postUpdateWorkshop);
router.get('/workshop/delete/:id', adminAccess, deleteWorkshop)

// admin backup
router.get('/backup', getBackup);

module.exports = router;