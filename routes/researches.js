const router = require('express').Router();

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/research/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename + '-' + file.originalname;
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
} = require('../controllers/researches');

const { adminAccess } = require('../middlewares/authorization');

router.get('/', getAllResearches);
router.post('/', adminAccess, postResearches);
router.post('/file', uploadPhoto, researchFile);
router.get('/new', adminAccess, getNewResearches);
router.get('/:id', getResearch);

module.exports = router;