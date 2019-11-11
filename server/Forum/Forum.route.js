const express = require('express');
const controller = require('./Forum.controller');

const router = express.Router();

router.get('/', controller.getForum);
router.get('/new', controller.getNewDiscussion);
router.get('/single', controller.getSingleDiscussion);

module.exports = router;
