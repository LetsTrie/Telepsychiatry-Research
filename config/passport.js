const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const { eUserModel } = require('../models/expertUser');
const { gUserModel } = require('../models/generalUser');
const { orgUserModel } = require('../models/orgUser');

const admin = {
    id: 'admin123',
    name: 'admin',
    email: 'admin@trin',
    password: '123456',
};

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
            async(req, email, password, done) => {
                // check for admin
                const Email = email.trim();
                console.log('email: ', req.body.email);
                if (req.body.email == admin.email) {
                    console.log('admin');
                    if (req.body.password == admin.password) {
                        done(null, admin);
                    } else {
                        req.flash('errorMessage', 'Incorrect password');
                        done(null, false);
                    }
                }

                const eUser = await eUserModel.findOne({ email: Email });
                console.log(eUser);
                // 3 user niye kaj korte hobe...
                let user;
                if (eUser) {
                    user = eUser;
                    console.log(eUser);
                    const matched = await bcrypt.compare(
                        req.body.password,
                        user.password
                    );
                    console.log(matched);
                    if (matched) {
                        console.log(user);
                        return done(null, user);
                    } else if (!matched) {
                        req.flash('errorMessage', 'Incorrect password');
                        return done(null, false);
                    }
                } else {
                    req.flash('errorMessage', 'Email not found');
                    done(null, false);
                }
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        if (id == admin.id) {
            //deserialize admin
            done(null, admin);
        } else {
            //otherwise check for others
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
        }
    });
};