const joi = require('@hapi/joi');

exports.validateTestData = (data) => {
    const compareWith = joi.object({
        testEng: joi.string().required(),
        testBan: joi.string().required(),
        nameEng: joi.string().required(),
        nameBan: joi.string().required(),
        age: joi.string().required(),
        paidInput: joi.string().required(),
        payAmount: joi.string().allow(null, ''),
        questions: joi.array().items(
            joi.object({
                questionEng: joi.string().required(),
                questionBan: joi.string().required(),
                Options: joi.array().items(
                    joi.object({
                        optionEng: joi.string().required(),
                        optionBan: joi.string().required(),
                        scale: joi.string().required(),
                    })
                ),
            })
        ),
    });
    return compareWith.validate(data);
};