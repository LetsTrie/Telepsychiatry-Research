const joi = require('@hapi/joi');

exports.validateInnovationData = (data) => {
    const compareWith = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        file: joi.string().required(),
    });
    return compareWith.validate(data);
};