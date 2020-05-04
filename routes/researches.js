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

const { adminAccess } = require('../middlewares/authorization');

router.get('/', getAllResearches);
router.post('/', postResearches);
router.post('/file', uploadPhoto, researchFile);
router.get('/new', (req, res) => {
    res.render('addResearchOthers');
});
router.get('/:id', getResearch);
router.get('/download/:id', downloadFile);

router.get('/update/:id', getUpdate);
router.post('/update', postUpdate);
module.exports = router;