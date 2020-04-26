const router = require('express').Router();
const {
  getResearches,
  postResearches,
  getNewResearches,
  getResearch,
} = require('../controllers/researches');

const { adminAccess } = require('../middlewares/authorization');

router.get('/', getResearches);
router.post('/', adminAccess, postResearches);
router.get('/new', adminAccess, getNewResearches);
router.get('/:id', getResearch);

module.exports = router;
