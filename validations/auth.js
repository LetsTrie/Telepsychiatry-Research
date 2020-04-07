const joi = require('@hapi/joi');

exports.regGenUserVal = (data) => {
  const compareWith = joi.object({
    fname: joi
      .string()
      .required()
      .regex(/^[a-z A-Z](?!.* {2})[ \w.-]{2,24}$/),
    lname: joi
      .string()
      .required()
      .regex(/^[a-z A-Z](?!.* {2})[ \w.-]{2,24}$/),
    email: joi
      .string()
      .required()
      .regex(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      ),
    password: joi.string().required().min(6),
    cPassword: joi.string().required().min(6),
    phoneNumber: joi.string().required().regex(/\w+/i).min(7),
    gender: joi.string().required(),
    country: joi.string().required(),
    dob: joi
      .string()
      .required()
      .regex(/^(\d{2})\/(\d{2})\/(\d{4})$/),
    cAffiliation: joi.string().required(),
    hADegree: joi.string().required(),
  });
  return compareWith.validate(data);
};

exports.regExpUserVal = (data) => {
  const compareWith = joi.object({
    name: joi.string().required(),
    email: joi
      .string()
      .regex(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )
      .required(),
    gender: joi.string().allow('', null),
    dob: joi.string().allow('', null),
    speciality: joi.string().allow('', null),
    propicURL: joi.string().required(),
    cvURL: joi.string().required(),
    institute: joi.string().allow('', null),
    expertise: joi.string().allow('', null),
    phone: joi.string().allow('', null).min(6).regex(/\w+/i),
    affiliation: joi.string().required(),
    researchArea: joi.string().allow('', null),
    professionalDegree: joi.string().allow('', null),
    regno: joi.string().allow('', null),
    country: joi.string().allow('', null),
    fee: joi.string().regex(/\w+/i).allow('', null),
    aboutYourself: joi.string().allow('', null),
    designation: joi.string().required(),
    password: joi.string().required().min(6),
    cpassword: joi.string().allow('', null).min(6),
    education: joi.array().items(
      joi.object({
        eduInstitute: joi.string().required(),
        degree: joi.string().required(),
        eduFrom: joi.string().allow('', null),
        eduTo: joi.string().allow('', null),
      })
    ),
    training: joi.array().items(
      joi.object({
        trainingName: joi.string().allow('', null),
        trainingYear: joi.string().allow('', null),
        trainingDetails: joi.string().allow('', null),
      })
    ),
    awards: joi.array().items(
      joi.object({
        awardsName: joi.string().allow('', null),
        awardsYear: joi.string().allow('', null),
        awardsDetails: joi.string().allow('', null),
      })
    ),
    workExperience: joi.array().items(
      joi.object({
        expInstitute: joi.string().allow('', null),
        expFrom: joi.string().allow('', null),
        expTo: joi.string().allow('', null),
      })
    ),
    visitingHour: joi.array().items(
      joi.object({
        chamberName: joi.string().allow('', null),
        chamberAddress: joi.string().allow('', null),
        shifts: joi.array().items(
          joi.object({
            dayFrom: joi.string().allow('', null),
            dayTo: joi.string().allow('', null),
            timeFrom: joi.string().allow('', null),
            timeTo: joi.string().allow('', null),
          })
        ),
      })
    ),
  });
  return compareWith.validate(data);
};
