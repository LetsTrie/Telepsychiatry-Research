const router = require('express').Router();
const forum = require('../controllers/forum');

router.get('/', forum.getForums);
router.get('/new', forum.createForum);
router.get('/:id', forum.singleForum);
router.post('/', forum.postDiscussion);
router.post('/react', forum.postReact);
router.post('/comment', forum.postComment);

module.exports = router;
