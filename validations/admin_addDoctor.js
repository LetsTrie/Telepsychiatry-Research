const Joi = require('@hapi/joi');

exports.addDoctorValidation = (data) =>
    Joi.object({
        name: Joi.string()
            .max(64)
            .pattern(/^([a-zA-Z]+)(\.?\s?[a-zA-Z]+)+$/, '[az][AZ][ .]')
            .required()
            .label('Fullname'),
        speciality: Joi.string()
            .allow(...['Psychiatric Consultator', 'Psycho Therapist'])
            .required()
            .label('Speciality'),
        gender: Joi.string()
            .allow(...['male', 'female'])
            .required()
            .label('Gender'),
        expertizeArea: Joi.string().required().label('Expertize Area'),
        designation: Joi.string().required().label('Designation'),
        institute: Joi.string().required().label('Institute'),
        fee: Joi.string()
            .pattern(/^[0-9]+$/, '[09]')
            .required()
            .label('Fee'),
        dob: Joi.string()
            .pattern(/^[0-9][0-9][/][0-9][0-9][/][0-9][0-9][0-9][0-9]$/)
            .required()
            .label('Date of Birth'),
        email: Joi.string().email().required().label('Email'),
        aboutYourself: Joi.string().required().label('About Yourself'),
        education: Joi.array().items(
            Joi.object().keys({
                instituteName: Joi.string().required(),
                degree: Joi.string().required(),
                year: Joi.array().items(Joi.string().required()),
            })
        ),
        workExperience: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                details: Joi.string().required(),
            })
        ),

        visitingTime: Joi.array().items(
            Joi.object().keys({
                from: Joi.string(),
                to: Joi.string(),
            })
        ),
        services: Joi.array().items(Joi.string().required()),
    }).validate(data);