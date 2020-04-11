const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const { eUserModel } = require('../models/expertUser');

module.exports = function(passport) {
    console.log('here');
    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async(req, email, password, done) => {
                // Match user

                const user = await eUserModel.findOne({ email: req.body.email });
                if (!user) {
                    console.log('email not found');
                    req.flash('errorMessage', 'Email not found');
                    return done(null, false);
                } else if (user) {
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
                }
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        eUserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });
};