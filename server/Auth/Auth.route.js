const express = require('express');
const {
  getLogin,
  getRegisterGeneralUser,
  getRegisterExpertUser,
  getRegisterOrganization,
  getCreateNewPassword,
  getVerifyMessage
} = require('./Auth.controller');

const router = express.Router();

router.get('/login', getLogin);
router.get('/register/general-user', getRegisterGeneralUser);
router.get('/register/expert-user', getRegisterExpertUser);
router.get('/register/organization', getRegisterOrganization);
router.get('/create-new-password', getCreateNewPassword);
router.get('/verify-message', getVerifyMessage);
module.exports = router;
