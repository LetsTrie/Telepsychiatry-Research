const { eUserModel } = require('../models/expertUser');
const nodemailer = require('nodemailer');

exports.doctorsProfile = async(req, res, next) => {
    const id = req.params.doc_id;
    console.log('id :', id);
    const doctor = await eUserModel.findOne({ _id: id });
    return res.render('doctorsProfile', {
        doctor
    });
};

exports.psychoTherapy = async(req, res, next) => {
    const doctors = await eUserModel.find();
    res.render('psycho_therapy');
};

exports.consultation = async(req, res, next) => {
    const doctors = await eUserModel.find();
    res.render('consultation', {
        doctors
    });
};

exports.bookAppointment = async(req, res) => {
    const { name, contact, age, bookType, date, time } = req.body;
    const reply = `Person with following details is in need of emergency service. 
        <br> 
        <hr>
        Name: <strong>${name} </strong> 
        <br>
        Contact: <strong>${contact} </strong> 
        <br>
        Age: <strong>${age} </strong>
        <br>
        Booking Type: <strong>${bookType} </strong> 
        <br>
        Date: <strong>${date} </strong>
        <br>
        Time: <strong>${time} </strong>
        <br> 
            - Thank you. TRIN`;
    const email1 = 'safwan.du16@gmail.com';
    const email2 = 'inzimunna@gmail.com';
    sendEmail(email1, reply);
    sendEmail(email2, reply);
    res.redirect('back');
};

function sendEmail(emailID, reply) {
    var Transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'safwan.du16@gmail.com',
            pass: ''
        }
    });

    var mailOptions;
    let sender = "'/'";
    mailOptions = {
        from: sender,
        to: 'safwan.du16@gmail.com',
        subject: 'Reply from TRIN',
        html: reply
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent');
        }
    });
}

exports.downloadCV = async(req, res, next) => {
    const path =
        '/home/mah-nigga/Projects/NewTRIN/Telepsychiatry-Research/public/uploads/' +
        req.params.name;
    res.download(path);
};