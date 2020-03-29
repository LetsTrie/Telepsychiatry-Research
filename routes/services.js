const router = require('express').Router();

router.get('/consultation', (req, res, next) => res.render('consultation'));
router.get('/psychoTherapy', (req, res, next) => res.render('psycho_therapy'));
router.get('/ourDoctors', (req, res, next) => res.render('ourDoctors'));
router.get('/doctor/profile/:id', (req, res, next) => {
    return res.render('doctorsProfile');
});
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