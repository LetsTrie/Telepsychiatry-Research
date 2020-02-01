const router = require('express').Router();

router.get('/consultation', (req, res, next) => res.render('consultation'));

module.exports = router;
