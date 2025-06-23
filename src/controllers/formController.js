const db = require("../models/queries");
const { body, validationResult } = require("express-validator");

async function formGet(req, res) {

    res.render("formView");
}

const formCategoryPost = 
    [

    body('category')
        .notEmpty().withMessage("Empty")
        .trim()
        .isAlpha().withMessage("Included non-alpha characters")
        .isLength({min: 3, max: 15}).withMessage("Length is not correct"),

    async (req, res) => {

        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).render("formView", {errors: result.errors});
        }

        const { category } = req.body;     
        await db.addCategory(category);

        res.redirect("../");
    }
];

module.exports = { formGet, formCategoryPost }; 