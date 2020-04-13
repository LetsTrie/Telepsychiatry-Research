const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const { eUserModel } = require('../models/expertUser');
const { gUserModel } = require('../models/generalUser');
const { orgUserModel } = require('../models/orgUser');

module.exports = function (passport) {
  console.log('here');
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const eUser = await eUserModel.findOne({ email: req.body.email });
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
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
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
