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
app.use(bodyParser.urlencoded({
    extended: false
}));
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

const port = process.env.PORT || 3007;

const server = app.listen(port, () =>
    console.log(`Server is running at port: ${port}`)
);
// for real time communications, to be used later
const io = require('socket.io').listen(server);
const connections = [];
const {
    appointment
} = require('./models/appointment');
// io.sockets.on('connection', (socket) => {
//     //Connect
//     connections.push(socket);
//     console.log('connected: ', connections.length);
//     const len = connections.length;
//     io.sockets.emit('poeple', 'wow');

//     //Disconnect
//     socket.on('disconnect', (data) => {
//         connections.splice(connections.indexOf(socket), 1);
//         console.log('disconnected! left:  ', connections.length);
//         const len = connections.length;
//         io.sockets.emit('poeple', { len });
//     });

//     socket.on('msg', (data) => {
//         console.log(data);
//         io.sockets.emit('msg', 'hello');
//     });

//     appointment.watch().on('change', (change) => {
//         console.log('update: ', change);
//         io.sockets.emit('new appointment', change);
//     });
// });