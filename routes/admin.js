const router = require('express').Router();

const { login, contactUs } = require('../controllers/admin');

router.get('/login', login);
router.get('/contactUs', contactUs);

module.exports = router;
