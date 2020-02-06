const router = require('express').Router();
const { createEvent } = require('../controllers/events')

router.get('/', (req, res, next) => res.render('events'));
router.get('/new', (req, res, next) => res.render('createEvents'));
router.get('/single', (req, res, next) => res.render('singleEvent'));
router.post('/new', (req, res) => {
    console.log('here')
    createEvent
})

module.exports = router;