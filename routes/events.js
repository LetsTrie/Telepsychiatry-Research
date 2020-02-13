const router = require('express').Router();

router.get('/', (req, res, next) => res.render('events'));
router.get('/new', (req, res, next) => res.render('createEvents'));
router.get('/single', (req, res, next) => res.render('singleEvent'));

module.exports = router;
