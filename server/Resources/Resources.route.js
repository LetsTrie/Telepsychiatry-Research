const express = require('express');
const controller = require('./Resources.controller');

const router = express.Router();

router.get('/', controller.getResources);

module.exports = router;
