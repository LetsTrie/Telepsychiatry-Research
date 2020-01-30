const router = require('express').Router();
const innovations = require('../controllers/innovations');

router.get('/', innovations.innovations);
router.get('/new', innovations.createInnovations);
router.post('/new', innovations.postInnovations);

module.exports = router;
