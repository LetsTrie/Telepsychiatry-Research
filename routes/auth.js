const router = require('express').Router();
const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const { eUserModel } = require('../models/expertUser');
const { gUserModel } = require('../models/generalUser');
const { sendGrid } = require('../config/sendMail');


const {
  getRegisterGeneralUser,
  getRegisterExpertUser,
  getRegisterOrganizations,
  postRegisterGeneralUser,
  postRegisterExpertUserData,
  postRegisterExpertUserFile,
  postRegisterOrgUser,
  postCheckDuplication,
  eUserCheckDuplication,
  postLogin,
  expProfile,
  verifyAccount,
  mail,
  updateExpertFile,
  getUpdateExpertProfile,
  postUpdateExpUser,
  getExpUser,
  postUpdateExpertPassword,
  postUpdateExpertPicture,
  changePassword,
  getMyAppointments,
} = require('../controllers/auth');

const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const filename = req.body.filename
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

const uploadPhoto = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single('exp_user_propic');

let checkNotNull = (val) => {
  return typeof val != 'undefined' && val != '' && val != null;
};

const { privateRoute } = require('../middlewares/authorization');

router.get('/login', (req, res, next) =>
  res.render('login', { user: req.user })
);
router.post('/login', postLogin);
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/auth/login');
});

router.get('/register/new/gen', getRegisterGeneralUser);
router.post('/register/new/gen', uploadPhoto, postRegisterGeneralUser);
router.post('/register/checkDuplicate', postCheckDuplication);
router.post('/register/eUserCheckDuplicate', eUserCheckDuplication);

router.get('/register/new/exp', getRegisterExpertUser);
router.post('/register/new/exp/file', uploadPhoto, postRegisterExpertUserFile);
router.post('/register/new/exp/data', postRegisterExpertUserData);

router.get('/register/new/org', getRegisterOrganizations);
router.post('/register/new/org', postRegisterOrgUser);

router.get('/user/profile', expProfile);
router.get('/verify/:id', verifyAccount);
router.get('/mail', mail);

//update routes
router.post('/update/exp/file', [privateRoute, uploadPhoto], updateExpertFile);
router.post('/update/exp/password', changePassword);
router.get('/update/exp/profile', privateRoute, getUpdateExpertProfile);
router.get('/getExpUser', privateRoute, getExpUser);
router.post('/update/exp/profile', privateRoute, postUpdateExpUser);
router.get('/update/exp/password', privateRoute, postUpdateExpertPassword);
router.get('/update/exp/profilePicture', privateRoute, postUpdateExpertPicture);

// Forgot Pass
router.post('/forgotPass', async (req, res) => {
  console.log(req.body);
  const {email} = req.body
  console.log({email})

  try {
    // selecting Patient or Doctor model according to role field value
    subject = 'Account password forgotten';
    let otp = cryptoRandomString({ length: 6 });
    let hashedOtp = '';

    // hashing the otp before saving to database
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(otp, salt, async (err, hash) => {
        if (err) {
          console.error(err);
          res.send({ error: err.message });
        }
        hashedOtp = hash;
        let user = await gUserModel.findOne({
          email: email,
        });
        if (!checkNotNull(user)){
          user = await eUserModel.findOne({
            email: email,
          });
        }
        if (!checkNotNull(user)) {
          console.log('user wasnot found with this credential');
          res.send({ error: 'Patient is not registered' });
          return;
        }

        user.otp = hashedOtp;
        await user.save();
        let mailBody = `<strong>Dear user,</strong>
          <br >
           We are providing you an one time password.Please use this one time password to login.After login please change the password.
          <br>
           Your one time password is: ${otp}
          <br >
          <br >
          Thanks for being with TRIN
          `;

        // sending mail
        let data = {
          address: user.email,
          subject: subject,
          body: mailBody,
        };
        sendGrid(data);
        res.send({
          success: 'We have sent you an email with temporary password',
        });
        return
      });
    });
  } catch (err) {
    console.error(err);
    res.send({ error: err.message });
    // throw err
  }
  return
});
router.get('/resetPass', async(req,res)=>{
  res.render('resetPassword', { user: req.user});
})
router.post('/resetPass', async (req, res) => {
  console.log(req.body)
  let { password, cPassword } = req.body;
  let errorMessage = '';
  if (password.length < 6)
    errorMessage = 'Password must contain at least 6 characters';
  else if (password !== cPassword) errorMessage = 'Passwords are not matching';
  console.log({errorMessage})
  if (errorMessage != '')
    res.render('resetPassword', { user: req.user, errorMessage });
  else {
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await eUserModel.findOne({ email: req.user.email });
    if(!checkNotNull(user)){
      user = await gUserModel.findOne({ email: req.user.email });
    }
    user.password = hashedPassword
    try{
      await user.save();
    }catch(err){
      console.err(err)
      res.render('resetPassword', { user: req.user, errorMessage: err.message });
      return
    }    
    res.redirect('/')
  };
  return
});
// Appointments
router.get('/appointments', privateRoute, getMyAppointments);

module.exports = router;
