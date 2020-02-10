const innovationModel = require("../models/innovations");
const { innovationValidation } = require("./validation");

const LIMIT = 9;
module.exports.getSingleInnovation = async(req, res) => {
    const id = req.params.id
    const singleInnovation = await innovationModel.findOne({ _id: id })
    res.render('singleInnovations', {
        data: singleInnovation
    })
}
module.exports.getInnovations = async(req, res, next) => {
    const page = +req.query.page || 1;
    const data = await innovationModel
        .find()
        .limit(LIMIT)
        .skip(LIMIT * page - LIMIT);
    const totalItems = await innovationModel.countDocuments();

    return res.render("innovations", {
        data: data,
        currentPage: page,
        hasNextPage: page * LIMIT < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / LIMIT)
    });
};

module.exports.createInnovations = (req, res, next) => {
    return res.render("createInnovations");
};

module.exports.postInnovations = async(req, res, next) => {
    const {
        title,
        BriefDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    } = req.body;

    let modifiedDesciption = BriefDesciption;

    if (BriefDesciption.startsWith("<p>") && BriefDesciption.endsWith("</p>")) {
        modifiedDesciption = BriefDesciption.substring(
            3,
            BriefDesciption.length - 4
        );
    }

    const newInnovations = new innovationModel({
        title,
        BriefDesciption: modifiedDesciption,
        conflictOfInterest,
        financialSupport,
        Acknowlegement,
        references,
        authors
    });

    await newInnovations.save();
    res.redirect("/innovations");
};

module.exports.searchInnovations = async(req, res, next) => {
    const { search } = req.body;

    const page = +req.query.page || 1;
    const data = await innovationModel
        .find({
            $or: [{
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    objective: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        })
        .limit(LIMIT)
        .skip(LIMIT * page - LIMIT);
    const totalItems = await innovationModel
        .find({
            $or: [{
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    objective: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    content: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        })
        .countDocuments();

    return res.render("innovations", {
        data: data,
        currentPage: page,
        hasNextPage: page * LIMIT < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / LIMIT)
    });
};