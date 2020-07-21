// OKAY
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { eUserModel } = require('../models/expertUser');

const { adminCredentials: admin } = require('./credentials');
const { gUserModel } = require('../models/generalUser');
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const Email = email.trim();

        if (Email == admin.email) {
          if (req.body.password == admin.password) {
            done(null, admin);
          } else {
            req.flash('errorMessage', 'Incorrect password');
            done(null, false);
          }
        } else {
          const eUser = await eUserModel.findOne({ email: Email });
          if (eUser) {
            let user = eUser;
            const matched = await bcrypt.compare(
              req.body.password,
              user.password
            );
            if (matched) {
              return done(null, user);
            } else if (!matched) {
              req.flash('errorMessage', 'Incorrect password');
              return done(null, false);
            }
          } else {
            const gUser = await gUserModel.findOne({ email: Email });
            if (gUser) {
              let user = gUser;
              const matched = await bcrypt.compare(
                req.body.password,
                user.password
              );
              if (matched) {
                return done(null, user);
              } else if (!matched) {
                req.flash('errorMessage', 'Incorrect password');
                return done(null, false);
              } else {
                req.flash('errorMessage', 'Email not found');
                return done(null, false);
              }
            }
          }
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    if (id == admin._id) {
      done(null, admin);
    } else {
      eUserModel.findById(id, (err, euser) => {
        if (euser) done(err, euser);
        else {
          gUserModel.findById(id, (err, guser) => {
            if (guser) {
              done(err, guser);
            } else {
              done(err);
            }
          });
        }
      });
    }
  });
};
