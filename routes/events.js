const router = require('express').Router();
const { getEvents, createEvent } = require('../controllers/events')

router.get('/', getEvents);
router.get('/new', (req, res, next) => res.render('createEvents'));
router.get('/single', (req, res, next) => res.render('singleEvent'));
router.post('/new', createEvent)

module.exports = router;