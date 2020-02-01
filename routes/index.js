const router = require('express').Router();

router.get('/', (req, res, next) => res.render('homepage'));
router.use('/researches', require('./researches'));
router.use('/innovations', require('./innovations'));
router.use('/forum', require('./forum'));
router.use('/events', require('./events'));
router.use('/auth', require('./auth'));
router.use('/contactUs', require('./contactUs'));
router.use('/services', require('./services'));
module.exports = router;
