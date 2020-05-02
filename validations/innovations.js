const joi = require('@hapi/joi');

exports.validateInnovationData = (data) => {
    const compareWith = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        name: joi.string().required(),
        designation: joi.string().required(),
        email: joi.string().required(),
        phone: joi.string().required(),
        collaboration: joi.string().allow('', null),
        collabScope: joi.string().required(),
        financialSupport: joi.string().required(),
        newsAndPub: joi.string().required(),
        innovationStage: joi.string().required(),
        link: joi.string().required(),
        file: joi.string().required(),
    });
    return compareWith.validate(data);
};