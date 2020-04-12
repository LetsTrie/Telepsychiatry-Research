const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const { eUserModel } = require('../models/expertUser');
const { gUserModel } = require('../models/generalUser');
const { orgUserModel } = require('../models/orgUser');

module.exports = function(passport) {
    console.log('here');
    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async(req, email, password, done) => {
                const gUser = await gUserModel.findOne({ email: req.body.email });
                const eUser = await eUserModel.findOne({ email: req.body.email });
                const oUser = await orgUserModel.findOne({ email: req.body.email });
                let user;
                if (gUser) {
                    user = gUser;
                    const hashed = await bcrypt.hash(req.body.password, 10);
                    const matched = await bcrypt.compare(
                        req.body.password,
                        user.password
                    );
                    if (matched) {
                        console.log(user);
                        return done(null, user);
                    } else if (!matched) {
                        req.flash('errorMessage', 'Incorrect password');
                        return done(null, false);
                    }
                } else if (eUser) {
                    user = eUser;
                    const hashed = await bcrypt.hash(req.body.password, 10);
                    const matched = await bcrypt.compare(
                        req.body.password,
                        user.password
                    );
                    if (matched) {
                        console.log(user);
                        return done(null, user);
                    } else if (!matched) {
                        req.flash('errorMessage', 'Incorrect password');
                        return done(null, false);
                    }
                } else if (oUser) {
                    user = oUser;
                    console.log(user);
                    const hashed = await bcrypt.hash(req.body.password, 10);
                    const matched = await bcrypt.compare(
                        req.body.password,
                        user.password
                    );
                    if (matched) {
                        console.log(user);
                        return done(null, user);
                    } else if (!matched) {
                        req.flash('errorMessage', 'Incorrect password');
                        return done(null, false);
                    }
                } else {
                    req.flash('errorMessage', 'Email not found');
                }
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        gUserModel.findById(id, (err, guser) => {
            if (guser) {
                done(err, guser);
            } else {
                eUserModel.findById(id, (err, euser) => {
                    if (euser) {
                        done(err, euser);
                    } else {
                        orgUserModel.findById(id, (err, ouser) => {
                            if (ouser) {
                                done(err, ouser);
                            } else {
                                done(err);
                            }
                        });
                    }
                });
            }
        });
    });
};