const router = require('express').Router();
const forum = require('../controllers/forum');

router.get('/', forum.getForum);
router.get('/single', forum.singleForum);
router.get('/new', forum.createForum);

module.exports = router;
