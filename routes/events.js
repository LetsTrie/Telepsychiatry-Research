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
}).single('workshopFile');

// router.get('/', getEvents);
// router.get('/new', (req, res, next) => res.render('createEvents'));
// router.get('/single', (req, res, next) => res.render('singleEvent'));
// router.post('/new', createEvent)

router.get('/workshop', getWorkshop);
router.get('/training', getTraining);
router.get('/workshop/new', getNewWorkshop);
router.get('/workshop/:id', singleWorkshop);
router.get('/training/new', getNewTraining);
router.post('/workshop/new', postWorkshop);
router.post('/workshop/new/file', uploadPhoto, workshopFile);
router.get('/showAll', eventsAll);

module.exports = router;