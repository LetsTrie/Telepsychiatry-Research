const router = require('express').Router();

const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/research/');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename;
    console.log(filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadPhoto = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single('researchFile');

const {
  getResearches,
  getAllResearches,
  postResearches,
  getNewResearches,
  getResearch,
  researchFile,
  downloadFile,
  getUpdate,
  postUpdate,
} = require('../controllers/researches');

const { adminAccess, privateRoute } = require('../middlewares/authorization');

router.get('/', getAllResearches);
router.post('/', privateRoute, postResearches);
router.post('/file', [privateRoute, uploadPhoto], researchFile);
router.get('/new', privateRoute, (req, res) => {
  res.render('addResearchOthers');
});
router.get('/:id', getResearch);
router.get('/download/:id', downloadFile);

router.get('/update/:id', privateRoute, getUpdate);
router.post('/update', privateRoute, postUpdate);
module.exports = router;
