const router = require('express').Router();

router.get('/', (req, res, next) => res.render('innovations'));
router.get('/new', (req, res, next) => res.render('createInnovations'));

module.exports = router;
