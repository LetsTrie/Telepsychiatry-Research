const Joi = require('@hapi/joi');

exports.userValidation = data =>
  Joi.object({
    name: Joi.string()
      .max(64)
      .pattern(/^([a-zA-Z]+)(\.?\s?[a-zA-Z]+)+$/, '[az][AZ][ .]')
      .required()
      .label('Fullname'),
    gender: Joi.string()
      .allow(...['male', 'female'])
      .required()
      .label('Gender'),
    expertizeArea: Joi.string()
      .required()
      .label('Expertize Area'),
    Designation: Joi.string()
      .required()
      .label('Designation'),
    Institute: Joi.string()
      .required()
      .label('Institute'),
    fee: Joi.string()
      .pattern(/^[0-9]+$/, '[09]')
      .required()
      .label('Fee'),
    aboutYourself: Joi.string()
      .required()
      .label('About Yourself'),

    education: Joi.array().items(
      Joi.object().keys({
        instituteName: Joi.string().required(),
        degree: Joi.string().required(),
        year: Joi.array().items(Joi.string().required())
      })
    ),
    workExperience: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        details: Joi.string().required()
      })
    ),
    services: Joi.array().items(Joi.string().required())
  }).validate(data);
