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

app.get('/checkmail', async(req, res, next) => {
    const nodemailer = require('nodemailer');
    const Transport = nodemailer.createTransport({
        pool: true,
        host: 'mail.trin-innovation.com.netsolmail.net.',
        port: 587,
        secure: false,
        logger: true,
        debug: true,
        auth: {
            user: 'manager@trin-innovation.com',
            pass: 'Mwjwy45@trin',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const x = await Transport.sendMail({
        from: 'manager@trin-innovation.com',
        to: 'sakibkhan111296@gmail.com',
        subject: 'TRIN account verification',
        html: 'xbody',
    });
    return res.json(x);
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running at port: ${port}`));