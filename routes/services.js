const router = require('express').Router();

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
  allSS,
  singleSS,
  bookSS,
  postBookSS,
} = require('../controllers/services');

router.get('/consultation', consultation);
router.get('/consultation/search', searchConsultation);
router.get('/psychoTherapy', psychoTherapy);
router.get('/psychoTherapy/search', searchPsychoTherapy);
router.get('/doctor/profile/:id', singleDoctorConsultation);

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

module.exports = router;
