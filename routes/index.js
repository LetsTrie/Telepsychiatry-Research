const router = require('express').Router();
const passport = require('passport');
const { postLogin } = require('../controllers/admin');
const { sendGrid } = require('../config/sendMail')
const admin = {
  id: 'admin123',
  name: 'admin',
  email: 'admin@trin',
  password: '123456',
};
const { workshopModel } = require('../models/workshop.js');

const { eUserModel } = require('../models/expertUser');
const getResetTime = (day) => {
  console.log(day);
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const dayNo = days.indexOf(day) + 1;
  var resetDate = new Date();
  resetDate.setDate(
    resetDate.getDate() + ((7 - resetDate.getDay()) % 7) + dayNo
  );
  resetDate.setHours(12);
  resetDate.setHours(resetDate.getHours() + 6);
  resetDate.setMinutes(0);
  console.log(resetDate);
  const dif = Math.round((resetDate - new Date()) / 1000);
  return dif;
};
router.get('/', async (req, res, next) => {
  // console.log(getResetTime('Friday'));
  const { eUserModel } = require('../models/expertUser.js');
  /*
  5ea6a986266de7450f67a0f5,
  5ed219ea536d3a1465951cf5,
  5e998ecb4fda502e5399178c,
  5e9ff70a2793470405c3d913,
  5ed3cce0d6e785040b85ec42
  */
  let exNames = [
    '5ea6a986266de7450f67a0f5',
    '5ed219ea536d3a1465951cf5',
    '5e998ecb4fda502e5399178c',
    '5e9ff70a2793470405c3d913',
    // '5ed3cce0d6e785040b85ec42',
  ];
  let experts = [];
  for (let i = 0; i < exNames.length; i++) {
    const expert = await eUserModel.findOne({ _id: exNames[i] });
    experts.push(expert);
  }

  const workshops = await workshopModel.find({ homepageDisplay: true })
  res.render('homepage', {
    ourExperts: experts,
    user: req.user,
    workshops
  });
});

router.get('/mail', (req, res) => sendGrid())

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
