const router = require('express').Router();
const passport = require('passport');
const { postLogin } = require('../controllers/admin');
const admin = {
    id: 'admin123',
    name: 'admin',
    email: 'admin@trin',
    password: '123456',
};

const { eUserModel } = require('../models/expertUser');

router.get('/', async(req, res, next) => {
    // $2a$10$.wX1L1QyW2zG1gdzh.qT3OSxwnAFtfuS8QSuiWSRhBJU21qtoDgQC
    // const eUser = require('../data/homepage_experts');
    const { eUserModel } = require('../models/expertUser.js');
    // Dr. Mohammed Zubayer Miah, Mohammad Golam Rabbani, Tanjir Rashid Soron, Sharmin Ara, Ashik Rahman, Md Ashiqur Rahman Ashiq
    let exNames = [
        'Dr. Mohammed Zubayer Miah',
        'Mohammad Golam Rabbani',
        'Sharmin Ara',
        'Ashik Rahman',
    ];
    let experts = [];
    for (let i = 0; i < exNames.length; i++) {
        const expert = await eUserModel.findOne({ name: exNames[i] });
        experts.push(expert);
        console.log(experts[i].name);
    }
    // console.log(experts);
    res.render('homepage', {
        ourExperts: experts,
        user: req.user,
    });
});
router.get('/getUser', (req, res, next) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send(null);
    }
});
router.use('/researches', require('./researches'));
router.use('/innovations', require('./innovations'));
router.use('/forum', require('./forum'));
router.use('/events', require('./events'));
router.use('/auth', require('./auth'));
router.use('/contactUs', require('./contactUs'));
router.use('/services', require('./services'));
router.use('/admin', require('./admin'));

module.exports = router;