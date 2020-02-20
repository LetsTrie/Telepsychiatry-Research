const router = require('express').Router();
const { getWorkshop, getTraining } = require('../controllers/events');

// router.get('/', getEvents);
// router.get('/new', (req, res, next) => res.render('createEvents'));
// router.get('/single', (req, res, next) => res.render('singleEvent'));
// router.post('/new', createEvent)

router.get('/workshop', getWorkshop);
router.get('/training', getTraining);

module.exports = router;
