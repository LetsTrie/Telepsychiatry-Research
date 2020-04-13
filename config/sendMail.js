const nodemailer = require('nodemailer');

let cred = {
  user: 'safwan.du16@gmail.com',
  pass: 'home761049997',
};

// const Transport = nodemailer.createTransport({
//   pool: true,
//   host: 'mail.trin-innovation.com',
//   port: 587,
//   secure: false,
//   logger: true,
//   debug: true,
//   auth: {
//     user: 'manager@trin-innovation.com',
//     pass: 'Mwjwy45@trin',
//   },
// });

const Transport = nodemailer.createTransport({
  service: 'gmail',
  auth: cred,
});

const host = `http://localhost:3000`;

// exports.mailCheck = async () => {
//   console.log('ENTERED');
//   return Transport.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Server is ready to take our messages');
//     }
//   });
// };

module.exports.AccountVerifyMail = async (email, userID) => {
  const mailBody = `Click <a href="${host}/auth/verify/${userID}">here</a> to verify your email.`;
  let mailOptions = {
    from: cred.user,
    to: email,
    subject: 'TRIN account verification',
    html: mailBody,
  };

  return Transport.sendMail(mailOptions);
};
