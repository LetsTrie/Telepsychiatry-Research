const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compress = require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

mongoose.connect(
    process.env.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    },
    () => console.log('connected to database!')
);

app.use(express.static('client'));
app.use(express.static('data'));
app.use(express.static('public'));

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const filename = req.body.filename + '-' + file.originalname;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).fields([{ name: 'exp_user_propic' }, { name: 'exp_cv' }])
);

if (process.env.NODE_ENV === 'development') app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.alertMessage = req.flash('alertMessage');
    next();
});
app.use(compress());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/', require('./routes'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at port: ${port}`));

// ClientID: 501935314157-nvttut507jaktvgl8b74g3jipa0vpia8.apps.googleusercontent.com
// ClientSecret: 8MDPS36C8heW_chrLxGSEFta