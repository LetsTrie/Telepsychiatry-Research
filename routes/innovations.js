const router = require('express').Router();
const innovations = require('../controllers/innovations');

router.get('/', innovations.getInnovations);
router.get('/new', innovations.createInnovations);
router.post('/', innovations.postInnovations);

module.exports = router;
