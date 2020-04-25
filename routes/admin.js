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
} = require('../controllers/admin');

const {
  adminAccess,
  canNotBeAuthenticated,
} = require('../middlewares/authorization');

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
  res.render('addDoctors');
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

module.exports = router;
