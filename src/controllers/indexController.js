const db = require("../models/queries");
const { body, validationResult } = require("express-validator");

const getIndex = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    res.render("index", {names, items:{}});
}

const getCategory = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    const {category} = req.params;

    if (category === 'all') {
        const rows = await db.getItems(true); 
        const items = rows.map(row => [row.categoryname, row.itemname]);
        return res.render("index", {names, items, category});
    }

    const rows = await db.getItemsOnCategory(category);
    const items = rows.map(row => [row.categoryname, row.itemname]);

    res.render("index", {names, items, category})
}

const getItem = async (req, res) => {
    const { item } = req.params; 
    const [returnedItem] = await db.getItem(item); 

    res.render("itemView", {item: returnedItem})
}

async function addItemGet(req, res) {
    const { category } = req.params; 

    const rows = await db.getItemsExceptCategory(category); 
    const itemnames = rows.map(row => row.itemname);

    res.render("formView", {category, itemnames});
}

const addItemPost = [
    body("itemname").notEmpty().withMessage("Empty")
        .trim()
        .isAlpha('en-US', {ignore: ' '}).withMessage("Included non-alpha characters")
        .isLength({min: 3, max: 15}).withMessage("Length is not correct")
        .custom(async (value, { req }) => {
            if (await db.itemExists(value)) {
            throw new Error('Item exists already');
            }
        }),

    async (req, res) => {
        const { category } = req.params; 

        const result = validationResult(req);

        const rows = await db.getItemsExceptCategory(category); 
        const itemnames = rows.map(row => row.itemname);

        if (!result.isEmpty()) {
            return res.status(400).render("formView", {category, itemnames, errors: result.errors});
        }

        const {itemname, price} = req.body; 
        await db.addItem({itemname, price}, category);

        res.redirect(`../${category}`);
    }
];

async function updateItem(req, res) {

    const { category } = req.params; 
    const itemToUpdate = req.body.updatedItem; 

    await db.updateItem(category, itemToUpdate);
    res.redirect(`../${category}`);
}

async function deleteItem(req, res) {

    const { category, item } = req.params; 
    await db.deleteCategoryItem(category, item); 
    res.redirect(`/${category}`);
}

module.exports = { getIndex, getCategory, getItem, addItemGet, addItemPost, updateItem, deleteItem }; 