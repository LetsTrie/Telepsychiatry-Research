const express = require('express');
const authRoutes = require('./server/Auth/Auth.route');

const router = express.Router();

router.get('/', (req, res) => res.render('homepage'));
router.use('/auth', authRoutes);

module.exports = router;
