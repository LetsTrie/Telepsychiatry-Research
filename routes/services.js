const router = require('express').Router();

router.get('/consultation', (req, res, next) => res.render('consultation'));
router.get('/ourDoctors', (req, res, next) => res.render('ourDoctors'));
router.get('/doctor/profile/:id', (req, res, next) => {
  return res.render('doctorsProfile');
});
module.exports = router;
