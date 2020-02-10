const router = require('express').Router();
const innovations = require('../controllers/innovations');

router.get('/', innovations.getInnovations);
router.post('/', innovations.createInnovations);
router.post('/search', innovations.searchInnovations);
router.get('/single/:id', innovations.getInnovation);

module.exports = router;
