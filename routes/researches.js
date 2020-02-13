const router = require('express').Router();
const {
    getResearches,
    postResearches,
    getNewResearches,
    getResearch
} = require('../controllers/researches');

router.get('/', getResearches);
router.post('/', postResearches);
router.get('/new', getNewResearches);
router.get('/:id', getResearch);

module.exports = router;