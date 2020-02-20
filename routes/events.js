const router = require('express').Router();
const {
  getWorkshop,
  getTraining,
  getNewWorkshop,
  getNewTraining,
  eventsAll
} = require('../controllers/events');

// router.get('/', getEvents);
// router.get('/new', (req, res, next) => res.render('createEvents'));
// router.get('/single', (req, res, next) => res.render('singleEvent'));
// router.post('/new', createEvent)

router.get('/workshop', getWorkshop);
router.get('/training', getTraining);
router.get('/workshop/new', getNewWorkshop);
router.get('/training/new', getNewTraining);

router.get('/showAll', eventsAll);

module.exports = router;
