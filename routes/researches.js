const router = require('express').Router();

router.get('/', (req, res, next) => res.render('researches'));
router.get('/new', (req, res, next) => res.render('createResearches'));

module.exports = router;
