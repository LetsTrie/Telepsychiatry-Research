const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const config = require('./config');
const routes = require('../index.route');

const app = express();
app.use(express.static('client'));
if (config.env === 'development') app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.alertMessage = req.flash('alertMessage');
  next();
});
app.use(cookieParser());
app.use(compress());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

app.use('/', routes);

module.exports = app;
