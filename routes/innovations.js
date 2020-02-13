const router = require('express').Router();
const {
    getInnovation,
    getInnovations,
    getNewInnovations,
    postInnovations
} = require('../controllers/innovations');

router.get('/', getInnovations);
router.get('/newInnovation', getNewInnovations);
router.post('/', postInnovations);

router.get('/:id', getInnovation);

module.exports = router;