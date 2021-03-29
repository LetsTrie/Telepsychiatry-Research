const router = require('express').Router();
const multer = require('multer');

const {
  bookAppointment,
  emergenceBooking,
  getEmergency,
  getEmBooking,
  approveEmergency,
  consultation,
  searchConsultation,
  psychoTherapy,
  searchPsychoTherapy,
  singleDoctorConsultation,
  getAllResearchers,
  searchResearchers,
  getBookAppointment,
  getChamberTimes,
  allAppointments,
  dateTimeReset,

  // special services
  allSS,
  singleSS,
  bookSS,
  postBookSS,
  addFeedback,
  addFeedbackVideo,

  // static
  staticPageLoader
} = require('../controllers/services');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('here');
    cb(null, 'public/feedback_ss/');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename;
    cb(null, filename);
  },
});
const uploadVideo = multer({
  storage: fileStorage,
}).single('ss_feedback_video');

router.get('/consultation', consultation);
router.get('/consultation/search', searchConsultation);
router.get('/psychoTherapy', psychoTherapy);
router.get('/psychoTherapy/search', searchPsychoTherapy);
router.get('/doctor/profile/:type/:id', singleDoctorConsultation);

router.get('/institution', (req, res, next) => {
  res.render('institution', { user: req.user });
});

router.get('/assessment', (req, res, next) => {
  res.render('assessment', { user: req.user });
});

router.get('/assessment/result', (req, res, next) => {
  res.render('assessment_result', { user: req.user });
});
router.get('/assessment/quiz', (req, res, next) => {
  res.render('assessment_quiz', { user: req.user });
});

router.get('/assessment/register', (req, res, next) => {
  res.render('assessment_reg', { user: req.user });
});

router.get('/special_services', allSS);
router.get('/special_services/:id', singleSS);
router.get('/special_services/book/:id', bookSS);
router.post('/special_services/book', postBookSS);
router.post('/special_services/feedback/', addFeedback);
router.post('/special_services/feedback/video', uploadVideo, addFeedbackVideo);

router.post('/book', bookAppointment);
router.post('/book/emergency', emergenceBooking);
router.get('/emergency/approve/:id', approveEmergency);
router.get('/researchers', getAllResearchers);
router.get('/search/researchers', searchResearchers);
router.get('/bookAppointment/:expID', getBookAppointment);
router.get('/emergencyAppointment/', getEmBooking);
router.get('/getTimes', getChamberTimes);
router.get('/all-appointments', allAppointments);
router.get('/emergency', getEmergency);
router.post('/date-time-reset', dateTimeReset);

// static page loading services

router.get('/static/:id', staticPageLoader)

module.exports = router;
