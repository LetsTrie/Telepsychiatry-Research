const router = require('express').Router();

router.get('/', (req, res, next) => res.render('forum'));
router.get('/single', (req, res, next) => res.render('singleDiscussion'));
router.get('/new', (req, res, next) => res.render('createDiscussion'));

module.exports = router;
