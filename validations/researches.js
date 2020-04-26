const joi = require('@hapi/joi');

exports.validateResearchData = (data) => {
    const compareWith = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        contactPerson: joi.string().required(),
        collaboration: joi.string().allow(null, ''),
        collabScope: joi.string().required(),
        financialSupport: joi.string().required(),
        newsAndPub: joi.string().required(),
        file: joi.string().required(),
        researchStage: joi.string().required(),
    });
    return compareWith.validate(data);
};