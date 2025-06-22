const db = require("../models/queries");

const getIndex = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    res.render("index", {names, items:{}});
}

const getCategory = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    const {category} = req.params;
    const rows = await db.getItemsOnCategory(category);
    const items = rows.map(row => [row.categoryname, row.itemname]);

    res.render("index", {names, items})
}

const getItem = async (req, res) => {

    const { item } = req.params; 
    const [returnedItem] = await db.getItem(item); 

    res.render("itemView", {item: returnedItem})
}

module.exports = { getIndex, getCategory, getItem }; 