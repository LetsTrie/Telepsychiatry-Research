const joi = require('@hapi/joi');

exports.validateResearchData = (data) => {
    const compareWith = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        researchStage: joi.string().required(),
        file: joi.string().required(),
    });
    return compareWith.validate(data);
};