const nodemailer = require('nodemailer');
const { eUserModel } = require('../models/expertUser');

exports.consultation = async(req, res) => {
    const experts = await eUserModel.find();
    res.render('consultation', {
        experts,
    });
};

exports.searchConsultation = async(req, res) => {
    let search = req.query.searchInput;
    const male = req.query.male;
    const female = req.query.female;
    let baseUrl = req.baseUrl;

    let searchedExperts = [];
    let maleExperts = [];
    let femaleExperts = [];

    if (search != '') {
        search = search.trim();
        let searchOptions = {
            $regex: search,
            $options: 'i',
        };
        let searchKey = {
            $or: [
                { name: searchOptions },
                { gender: searchOptions },
                { speciality: searchOptions },
                { designation: searchOptions },
                { affiliation: searchOptions },
                { dob: searchOptions },
                { email: searchOptions },
                { phone: searchOptions },
                { aboutYourself: searchOptions },
                { institution: searchOptions },
                { researchArea: searchOptions },
                { regno: searchOptions },
                { country: searchOptions },
                { fee: searchOptions },
                { expertise: searchOptions },
            ],
        };
        searchedExperts = await eUserModel.find(searchKey);
    }

    if (male == 'on') {
        searchKey = {
            $or: [{ gender: 'Male' }],
        };
        maleExperts = await eUserModel.find(searchKey);
    }
    if (female == 'on') {
        searchKey = {
            $or: [{ gender: 'Female' }],
        };
        femaleExperts = await eUserModel.find(searchKey);
    }
    let mergedExperts = searchedExperts.concat(maleExperts, femaleExperts);
    let final = Array.from(new Set(mergedExperts.map((item) => item._id))).map(
        (_id) => {
            return {
                _id: _id,
                name: mergedExperts.find((exp) => exp._id === _id).name,
                designation: mergedExperts.find((exp) => exp._id === _id).designation,
                institute: mergedExperts.find((exp) => exp._id === _id).institute,
                fee: mergedExperts.find((exp) => exp._id === _id).fee,
                professionalDegree: mergedExperts.find((exp) => exp._id === _id)
                    .professionalDegree,
                affiliation: mergedExperts.find((exp) => exp._id === _id).affiliation,
                gender: mergedExperts.find((exp) => exp._id === _id).gender,
            };
        }
    );
    res.render('consultation', {
        experts: final,
    });
};

exports.bookAppointment = async(req, res) => {
    const { service, name, contact, age, bookType, date, time } = req.body;
    console.log(req.body);
    const reply = `Person with following details is in need of emergency <strong>${service}</strong> service. 
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
            pass: '',
        },
    });

    var mailOptions;
    let sender = "'/'";
    mailOptions = {
        from: sender,
        to: 'safwan.du16@gmail.com',
        subject: 'Reply from TRIN',
        html: reply,
    };

    Transport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent');
        }
    });
}