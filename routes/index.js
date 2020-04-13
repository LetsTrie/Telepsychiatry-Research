const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.render('homepage');
});
router.get('/getUser', (req, res, next) => {
    if (req.user) {
        // console.log(req.user);
        res.send(req.user);
    } else {
        res.send(null);
    }
});
router.use('/researches', require('./researches'));
router.use('/innovations', require('./innovations'));
router.use('/forum', require('./forum'));
router.use('/events', require('./events'));
router.use('/auth', require('./auth'));
router.use('/contactUs', require('./contactUs'));
router.use('/services', require('./services'));
router.use('/admin', require('./admin'));

module.exports = router;