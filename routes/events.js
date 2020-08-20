const router = require('express').Router();
const {
  getWorkshop,
  getTraining,
  getNewWorkshop,
  getNewTraining,
  singleWorkshop,
  postWorkshop,
  workshopFile,
  eventsAll,
  regForWorkshop,
  addComment,
} = require('../controllers/events');

const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/workshop/');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename;
    console.log('filename: ', filename);
    cb(null, filename);
  },
});

const commentVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/workshop/videos');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename;
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

const uploadPhotoWorkshop = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single('workshopFile');

const uploadVideo = multer({
  storage: commentVideoStorage,
}).single('video');

// router.get('/', getEvents);
// router.get('/new', (req, res, next) => res.render('createEvents'));
// router.get('/single', (req, res, next) => res.render('singleEvent'));
// router.post('/new', createEvent)

router.get('/workshop', getWorkshop);
router.get('/training', getTraining);
router.get('/workshop/:id', singleWorkshop);
router.get('/training/new', getNewTraining);
router.get('/showAll', eventsAll);
router.get('/workshop/reg/:id', regForWorkshop);
router.post('/workshop/add-comment', uploadVideo, addComment);

module.exports = router;
