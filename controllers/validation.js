const Joi = require('@hapi/joi');

const innovationValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(8).required(),
        projectType: Joi.string().required(),
        tags: Joi.string().regex(/^([^0-9]+)$/),
        objective: Joi.string().min(20).required(),
        content: Joi.string().min(20).required()
    });
    return schema.validate(data);
};

module.exports.innovationValidation = innovationValidation;
