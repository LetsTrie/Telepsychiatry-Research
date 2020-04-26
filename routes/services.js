const router = require('express').Router();

const {
    bookAppointment,
    consultation,
    searchConsultation,
    psychoTherapy,
    searchPsychoTherapy,
    singleDoctorConsultation,
    getAllResearchers,
    searchResearchers,
} = require('../controllers/services');

router.get('/consultation', consultation);
router.get('/consultation/search', searchConsultation);

router.get('/psychoTherapy', psychoTherapy);
router.get('/psychoTherapy/search', searchPsychoTherapy);
// (req, res, next) =>
//   res.render('psycho_therapy')
// );

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

router.get('/special_services', (req, res, next) => {
    res.render('specialServices', { user: req.user });
});

router.post('/book', bookAppointment);

router.get('/researchers', getAllResearchers);
router.get('/search/researchers', searchResearchers);

module.exports = router;