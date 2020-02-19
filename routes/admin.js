const router = require('express').Router();

const { contactUs } = require('../controllers/admin');

router.get('/contactUs', contactUs);

module.exports = router;
