const router = require('express').Router();

router.get('/consultation', (req, res, next) => res.render('consultation'));
router.get('/psychoTherapy', (req, res, next) => res.render('psycho_therapy'));
router.get('/doctor/profile/:id', (req, res, next) => {
  return res.render('doctorsProfile');
});
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

module.exports = router;
