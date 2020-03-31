const router = require('express').Router();
const {
    doctorsProfile,
    psychoTherapy,
    consultation
} = require('../controllers/services');

router.get('/consultation', consultation);
router.get('/psychoTherapy', psychoTherapy);
router.get('/ourDoctors', (req, res, next) => res.render('ourDoctors'));
router.get('/doctor/profile/:id', doctorsProfile);
router.get('/institution', (req, res, next) => {
    const names = [
        'Liver Profile',
        'Blood Test',
        'General Test',
        'Hepatitis B Test',
        'COVID-19 Test'
    ];
    res.render('institution', {
        names
    });
});
router.get('/singleInstitution', (req, res, next) => {
    res.render('singleInstitution');
});
module.exports = router;

router.get('/assessment', (req, res, next) => {
    res.render('assessment');
});

router.get('/assessment/questions', (req, res, next) => {
    res.render('assessment_ques');
});

router.get('/assessment/result', (req, res, next) => {
    res.render('assessment_result');
});
module.exports = router;