const router = require('express').Router();

router.get('/', (req, res, next) => res.render('homepage'));
router.use('/resources', require('./resources'));
router.use('/innovations', require('./innovations'));
router.use('/forum', require('./forum'));
router.use('/events', require('./events'));
router.use('/auth', require('./auth'));
router.use('/aboutUs', require('./aboutUs'));

module.exports = router;
