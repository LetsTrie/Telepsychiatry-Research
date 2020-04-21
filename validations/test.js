const joi = require('@hapi/joi');

exports.validateTestData = (data) => {
    const compareWith = joi.object({
        testEng: joi.string().required(),
        testBan: joi.string().required(),
        disorderNameEng: joi.string().required(),
        disorderNameBan: joi.string().required(),
        age: joi.string().required(),
        isPaid: joi.string().required(),
        payAmount: joi.string().allow(null, ''),
        language: joi.array().items(joi.string()),
        questionSet: joi.array().items(
            joi.object({
                language: joi.string().required(),
                Questions: joi.array().items(
                    joi.object({
                        question: joi.string().required(),
                        questionScale: joi.string().allow(null, ''),
                        Options: joi.array().items(
                            joi.object({
                                option: joi.string().required(),
                                optionScale: joi.string().allow(null, ''),
                            })
                        ),
                    })
                ),
            })
        ),
    });
    return compareWith.validate(data);
};