const { eUserModel } = require('../models/expertUser');

exports.doctorsProfile = async(req, res, next) => {
    const id = req.params.id;
    console.log('id :', id);
    const doctor = await eUserModel.findOne({ _id: id });
    console.log(doctor);
    return res.render('doctorsProfile', {
        doctor
    });
};

exports.psychoTherapy = async(req, res, next) => {
    const doctors = await eUserModel.find();
    console.log(doctors);
    res.render('psycho_therapy');
};

exports.consultation = async(req, res, next) => {
    const doctors = await eUserModel.find();
    res.render('consultation', {
        doctors
    });
};