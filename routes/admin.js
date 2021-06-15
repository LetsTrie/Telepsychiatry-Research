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
  adminUpdateResearchFile,
  getAllResearches,
  getAdminUpdateResearch,
  postAdminUpdateResearch,
  getUnverifiedResearches,
  deleteResearch,

  // innovations
  postInnovation,
  innovationFile,
  adminUpdateInnovationFile,
  getAdminInnovations,
  getAdminInnovation,
  getAdminUpdateInnovation,
  postAdminUpdateInnovation,
  getUnverifiedInnoations,
  deleteInnovation,

  // workshops
  postWorkshop,
  workshopFile,
  getWorkshop,
  singleWorkshop,
  getUpdateWorkshop,
  postUpdateWorkshop,
  updateWorkshopFile,
  deleteWorkshop,
  addWorkshopToHomepage,
  removeWorkshopFromHomepage,

  // trainings
  getTraining,
  singleTraining,
  postTraining,
  trainingFile,
  getUpdateTraining,
  postUpdateTraining,
  updateTrainingFile,
  deleteTraining,

  // special service
  getSS,
  singleSS,
  getAdminNewSpecialService,
  postAdminNewSS,
  ssFile,
  updateSSFile,
  getExperts,
  deleteSpecialService,
  getUpdateSingleSS,
  postUpdateSingleSS,
  getSSBookRequests,
  approveSSBookRequest,
  toggleFeedback,
  deleteBook,

  // management
  getExpertPriorities,
  setExpertPriorities,
  setWorkshopPriorities,
  setResearchPriorities,
  setTrainingPriorities,
  getCommunications,

  // backup
  getBackup,
} = require('../controllers/admin');

const { workshopModel } = require('../models/workshop');

const {
  adminAccess,
  canNotBeAuthenticated,
} = require('../middlewares/authorization');

const multer = require('multer');
const { trainingModel } = require('../models/training');
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
    cb(null, 'public/workshop/');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename;
    cb(null, filename);
  },
});

const trainingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/training/');
  },
  filename: (req, file, cb) => {
    const filename = Date.parse(new Date().toString()) + '-' + file.originalname;
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

const uploadPhotoTraining = multer({
  storage: trainingStorage,
}).fields([
  { name: 'trainingFile' },
  { name: 'trainingCertificate' }
]);

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
router.post(
  '/research/update/file',
  adminAccess,
  uploadResearchFile,
  adminUpdateResearchFile
);
router.get('/researches/unverified', adminAccess, getUnverifiedResearches);
router.get('/research/delete/:id', adminAccess, deleteResearch)

// special services
router.get('/special_service', adminAccess, getSS);
router.get('/special_service/:id', adminAccess, singleSS);
router.get('/new/specialService', adminAccess, getAdminNewSpecialService);
router.post('/new/specialService', adminAccess, postAdminNewSS);
router.post('/new/specialService/file', [adminAccess, uploadPhotoSS], ssFile);
router.post('/new/specialService', adminAccess, postAdminNewSS);
router.get('/new/specialService/getExperts', adminAccess, getExperts);
router.get('/specialService/delete/:id', adminAccess, deleteSpecialService);
router.get('/specialService/update/:id', adminAccess, getUpdateSingleSS);
router.post('/specialService/update', adminAccess, postUpdateSingleSS);
router.post(
  '/specialService/update/file',
  adminAccess,
  uploadPhotoSS,
  updateSSFile
);

router.get('/special_services/all-requests', adminAccess, getSSBookRequests);
router.get(
  '/special_services/approve/:apt_id/:ss_id',
  adminAccess,
  approveSSBookRequest
);
router.get('/special_services/toggle/:id', adminAccess, toggleFeedback);
router.get('/special_service/delete-book/:pid/:sid', adminAccess, deleteBook);

// admin innovations
router.get('/innovation/new', adminAccess, (req, res) => {
  const { user } = req.user;
  return res.render('addInnovationFromAdmin', { user });
});
router.post('/innovation/new', adminAccess, postInnovation);
router.post(
  '/innovation/new/file',
  [adminAccess, uploadInnovationFile],
  innovationFile
);
router.get('/innovations', adminAccess, getAdminInnovations);
router.get('/innovation/:id', adminAccess, getAdminInnovation);
router.get('/innovation/update/:id', adminAccess, getAdminUpdateInnovation);
router.post('/innovation/update', adminAccess, postAdminUpdateInnovation);
router.post(
  '/innovation/update/file',
  [adminAccess, uploadInnovationFile],
  adminUpdateInnovationFile
);

router.get('/innovations/unverified', adminAccess, getUnverifiedInnoations);
router.get('/innovation/delete/:id', adminAccess, deleteInnovation)


// admin workshop

router.get('/workshop/new', async (req, res) => {
  let workshops = await workshopModel.find({}, 'priority');
  // console.log({ workshops });  
  let mxPriority = 0;
  workshops.forEach((obj) => {
    if (obj.priority != null) {
      mxPriority = Math.max(mxPriority, obj.priority);
    }
  });
  console.log({ mxPriority });
  res.render('add-new-workshop', { user: req.user, mxPriority });
});
router.post('/workshop/new', postWorkshop);
router.post(
  '/workshop/new/file',
  [adminAccess, uploadPhotoWorkshop],
  workshopFile
);
router.get('/workshop', adminAccess, getWorkshop);
router.get('/workshop/:id', adminAccess, singleWorkshop);
router.get('/workshop/update/:id', adminAccess, getUpdateWorkshop);
router.post('/workshop/update', adminAccess, postUpdateWorkshop);
router.post(
  '/workshop/update/file',
  [adminAccess, uploadPhotoWorkshop],
  updateWorkshopFile
);

router.get('/workshop/delete/:id', adminAccess, deleteWorkshop);
router.get('/workshop/add-to-homepage/:id', adminAccess, addWorkshopToHomepage);
router.get(
  '/workshop/rem-from-homepage/:id',
  adminAccess,
  removeWorkshopFromHomepage
);

// Admin training sessions

router.get('/training', adminAccess, getTraining)
router.get('/training/new', adminAccess, async (req, res) => {
  let trainings = await trainingModel.find({}, 'priority');
  // console.log({ workshops });  
  let mxPriority = 0;
  trainings.forEach((obj) => {
    if (obj.priority != null) {
      mxPriority = Math.max(mxPriority, obj.priority);
    }
  });
  console.log({ mxPriority });
  res.render('addNewTraining', { mxPriority })
})
router.get('/training/:id', adminAccess, singleTraining)
router.post('/training/new', adminAccess, postTraining)
router.post('/training/new/file', [adminAccess, uploadPhotoTraining], trainingFile)
router.get('/training/update/:id', adminAccess, getUpdateTraining)
router.post('/training/update/', adminAccess, postUpdateTraining)
router.post(
  '/training/update/file',
  [adminAccess, uploadPhotoTraining],
  updateTrainingFile
);
router.get('/training/delete/:id', adminAccess, deleteTraining)

// Expert priority settings

router.get('/management/expert-priorities', getExpertPriorities);
router.post('/management/expert-priorities', setExpertPriorities);
router.post('/management/workshop-priorities', setWorkshopPriorities);
router.post('/management/research-priorities', setResearchPriorities);
router.post('/management/training-priorities', setTrainingPriorities);
router.get('/management/communications', adminAccess, (req, res) => res.render('Communications'))
router.get('/management/communcations/range', adminAccess, getCommunications)

// admin backup
router.get('/backup', getBackup);

module.exports = router;
