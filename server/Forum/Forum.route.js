const express = require('express');
const controller = require('./Forum.controller');

const router = express.Router();

router.get('/', controller.getForum);

module.exports = router;
