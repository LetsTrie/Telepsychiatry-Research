const router = require('express').Router();
const forum = require('../controllers/forum');

router.get('/', forum.getForum);
router.get('/:id', forum.singleForum);
router.get('/new', forum.createForum);
router.post('/', forum.postDiscussion);

module.exports = router;
