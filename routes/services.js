const router = require('express').Router();

const {
  bookAppointment,
  consultation,
  searchConsultation,
  singleDoctorConsultation,
} = require('../controllers/services');

router.get('/consultation', consultation);
router.get('/consultation/search', searchConsultation);

router.get('/psychoTherapy', (req, res, next) => res.render('psycho_therapy'));
router.get('/doctor/profile/:id', singleDoctorConsultation);

router.get('/institution', (req, res, next) => {
  res.render('institution');
});

router.get('/assessment', (req, res, next) => {
  res.render('assessment');
});

router.get('/assessment/result', (req, res, next) => {
  res.render('assessment_result');
});
router.get('/assessment/quiz', (req, res, next) => {
  res.render('assessment_quiz');
});

router.get('/assessment/register', (req, res, next) => {
  res.render('assessment_reg');
});

router.get('/special_services', (req, res, next) => {
  res.render('specialServices');
});

router.post('/book', bookAppointment);

module.exports = router;
