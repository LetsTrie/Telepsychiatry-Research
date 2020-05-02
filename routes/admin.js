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

  // innovations
  postInnovation,
  innovationFile,
  getAdminInnovations,
  getAdminInnovation,
  getAdminUpdateInnovation,
  postAdminUpdateInnovation,

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
router.get('/researches', getAdminResearches);
router.get('/research/:id', getAdminResearch);
router.get('/new/research', getAdminNewResearch);
router.post('/research/new', postResearches);
router.post('/research/new/file', uploadResearchFile, researchFile);
router.get('/research/update/:id', getAdminUpdateResearch);
router.post('/research/update', postAdminUpdateResearch);

// admin innovations
router.get('/innovation/new', (req, res) => {
  res.render('addInnovationFromAdmin', {
    user: req.user,
  });
});
router.post('/innovation/new', postInnovation);
router.post('/innovation/new/file', uploadInnovationFile, innovationFile);
router.get('/innovations', getAdminInnovations);
router.get('/innovation/:id', getAdminInnovation);
router.get('/innovation/update/:id', getAdminUpdateInnovation);
router.post('/innovation/update', postAdminUpdateInnovation);

router.get('/backup', getBackup);

module.exports = router;
