const router = require('express').Router();
const resources = require('../controllers/resources')

router.get("/",
    resources.get_resources
);
router.get('/new', (req, res, next) => res.render('createResearches'));
router.post('/new_research', resources.post_resources)

module.exports = router;