const router = require('express').Router();
const multer = require('multer');
const {
    getInnovation,
    getInnovations,
    getNewInnovations,
    postInnovations,
    innovationFile,
    downloadFile,
} = require('../controllers/innovations');

const innovationStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('here');
        cb(null, 'public/innovation/');
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
const uploadInnovationFile = multer({
    storage: innovationStorage,
    fileFilter: fileFilter,
}).single('innovationFile');

router.get('/', getInnovations);
router.get('/new', (req, res) => {
    res.render('addInnovationsOthers', {
        user: req.user,
    });
});
router.post('/', postInnovations);
router.post('/new/file', uploadInnovationFile, innovationFile);

router.get('/:id', getInnovation);
router.get('/download/:id', downloadFile);

module.exports = router;