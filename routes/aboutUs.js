const router = require('express').Router();

const controller = require('../controllers/aboutUs');
router.get('/', controller.getAboutUsPage);

module.exports = router;
