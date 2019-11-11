const express = require('express');
const authRoutes = require('./server/Auth/Auth.route');
const forumRoutes = require('./server/Forum/Forum.route');
const resourcesRoutes = require('./server/Resources/Resources.route');

const router = express.Router();

router.get('/', (req, res) => res.render('homepage'));
router.use('/auth', authRoutes);
router.use('/forum', forumRoutes);
router.use('/resources', resourcesRoutes);
module.exports = router;
