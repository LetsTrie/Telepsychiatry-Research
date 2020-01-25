const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.render('homepage');
});

router.get('/forum', (req, res, next) => {
  res.render('forum');
});

router.get('/forum/single', (req, res, next) => {
  res.render('singleDiscussion');
});

router.get('/forum/new', (req, res, next) => {
  res.render('createDiscussion');
});

router.get('/resources', (req, res, next) => {
  res.render('resources');
});

router.get('/resources/new', (req, res, next) => {
  res.render('createResources');
});

router.get('/innovations', (req, res, next) => {
  res.render('innovations');
});

router.get('/innovations/new', (req, res, next) => {
  res.render('createInnovations');
});

router.get('/events', (req, res, next) => res.render('events'));
router.get('/events/new', (req, res, next) => res.render('createEvents'));
router.get('/events/single', (req, res, next) => res.render('singleEvent'));

router.get('/aboutUs', (req, res, next) => res.render('aboutUs'));
module.exports = router;
