const router = require('express').Router();

const {
    login,
    contactUs,
    adminGetResearch,
    getResearch,
    approveResearch,
    disapproveResearch,
    getInnovations,
    singleInnoavtion,
    approveInnovation,
    disapproveInnovation,
    postAddDoctor
} = require('../controllers/admin');

router.get('/login', login);
router.get('/contactUs', contactUs);

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