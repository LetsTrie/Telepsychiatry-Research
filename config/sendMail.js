// OKAY
const nodemailer = require('nodemailer');

const Transport = nodemailer.createTransport({
  host: 'mail.trin-innovation.com.netsolmail.net',
  port: 587,
  auth: {
    user: 'info@trin-innovation.com',
    pass: 'T59j@9j0gw690j',
    // Mwjwy45@trin
  },
  logger: true,
  debug: true,
  secureConnection: 'false',
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

// const host = `http://localhost:3000`;
const host = `http://trin-innovation.com`;

module.exports.AccountVerifyMail = async (email, userID) => {
  const mailBody = `Click <a href="${host}/auth/verify/${userID}">here</a> to verify your email.`;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'TRIN account verification',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};

module.exports.ssConfirmMail = async (email, mediaID, mode) => {
  console.log(email);
  let mailBody = '';
  if (mode == 'FaceToFace') {
    mailBody = `Your request for our special services has been approved.<br> Thanks for being with us.`;
  } else {
    mailBody = `Your request for our special services has been approved.<br> Please click on <a href=https://media.monerdaktar.com/${mediaID}>this link</a> to continue.<br> Thanks for being with us.`;
  }
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'Special Service Request Confirmation',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};
