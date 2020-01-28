const router = require('express').Router();

router.get('/', (req, res, next) => res.render('resources'));
router.get('/new', (req, res, next) => res.render('createResources'));

module.exports = router;
