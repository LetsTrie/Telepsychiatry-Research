const nodemailer = require('nodemailer');

const Transport = nodemailer.createTransport({
  pool: true,
  host: 'mail.trin-innovation.com.netsolmail.net.',
  port: 587,
  secure: false,
  logger: true,
  debug: true,
  auth: {
    user: 'manager@trin-innovation.com',
    pass: 'Mwjwy45@trin',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const host = `http://localhost:3000`;

module.exports.AccountVerifyMail = async (email, userID) => {
  const mailBody = `Click <a href="${host}/auth/verify/${userID}">here</a> to verify your email.`;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'TRIN account verification',
    html: mailBody,
  };

  return Transport.sendMail(mailOptions);
};
