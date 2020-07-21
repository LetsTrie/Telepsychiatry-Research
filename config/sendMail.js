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
  const mailBody = `<strong>Dear User,</strong> <br>
  Please click <a href="${host}/auth/verify/${userID}">here</a> to verify your email. <br>
  Thanks for joining TRIN`;
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'TRIN account verification',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};

module.exports.ssConfirmMail = async (booking, ss) => {
  console.log(booking);
  const { email, bookingType, patient_id, schedule, ss_name, name } = booking;

  let mailBody = '';
  if (bookingType == 'FaceToFace') {
    mailBody = `<strong>Dear ${name},</strong>
    <br >
    Your request for our special service entitled ${ss_name} has been confirmed. 
    <br>
    Please take note of the following meeting details
    <br >
    <br >
    <strong>
      Mode of meeting: Offline <br >
      Time: Next ${ss.schedule.weekDay} at ${ss.schedule.start} <br >
      Address: Rupayan Trade Center, 2nd Floor, Banglamotor, Dhaka-1215, Bangladesh <br >
    </strong>
    <br >
    Thanks for being with TRIN
     `;
  } else {
    mailBody = `<strong>Dear ${name},</strong>
    <br >
    Your request for our special service entitled ${ss_name} has been confirmed. 
    <br>
    Please take note of the following meeting details
    <br >
    <br >
    <strong>
      Mode of meeting: Online <br >
      Time: Next ${ss.schedule.weekDay} at ${ss.schedule.start} <br >
      Address (Online): https://media.monerdaktar.com/${patient_id} <br >
    </strong>
    <br >
    Thanks for being with TRIN
     `;
  }
  let mailOptions = {
    from: 'manager@trin-innovation.com',
    to: email,
    subject: 'Special Service Request Confirmation',
    html: mailBody,
  };

  return await Transport.sendMail(mailOptions);
};
