const router = require('express').Router();

const { getContactUsPage, postContactUsPage } = require('../controllers/contactUs');
router.get('/', getContactUsPage);
router.post('/', postContactUsPage);

module.exports = router;
