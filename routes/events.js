const router = require('express').Router();
const {
  // Training sessions

  getTraining,
  singleTraining,
  regForTraining,

  // Workshops

  getWorkshop,
  getNewWorkshop,
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

// Workshops

router.get('/workshop', getWorkshop);
router.get('/workshop/:id', singleWorkshop);
router.get('/workshop/reg/:id', regForWorkshop);
router.post('/workshop/add-comment', uploadVideo, addComment);

// Training Sessions

router.get('/training', getTraining);
router.get('/training/:id', singleTraining)
router.get('/training/reg/:id', regForTraining);


module.exports = router;
