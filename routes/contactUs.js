const router = require('express').Router();

const {
    getContactUsPage,
    postContactUsPage,
    emergency
} = require('../controllers/contactUs');
router.get('/', getContactUsPage);
router.post('/', postContactUsPage);
router.post('/emergency', emergency);

module.exports = router;