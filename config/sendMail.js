// OKAY
const nodemailer = require('nodemailer');

const Transport = nodemailer.createTransport({
  host: 'mail.trin-innovation.com.netsolmail.net.',
  port: 587,
  auth: {
    user: 'manager@trin-innovation.com',
    pass: 'Mwjwy45@trin',
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
