const router = require('express').Router();

const { getContactUsPage } = require('../controllers/contactUs');
router.get('/', getContactUsPage);

module.exports = router;
