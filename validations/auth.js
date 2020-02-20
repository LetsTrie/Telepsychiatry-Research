const joi = require('@hapi/joi');

exports.regGenUserVal = data => {
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
    password: joi
      .string()
      .required()
      .min(6),
    cPassword: joi
      .string()
      .required()
      .min(6),
    phoneNumber: joi
      .string()
      .required()
      .regex(/\w+/i)
      .min(7),
    gender: joi.string().required(),
    country: joi.string().required(),
    dob: joi
      .string()
      .required()
      .regex(/^(\d{2})\/(\d{2})\/(\d{4})$/),
    cAffiliation: joi.string().required(),
    hADegree: joi.string().required()
  });
  return compareWith.validate(data);
};
