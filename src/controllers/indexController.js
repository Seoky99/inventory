const db = require("../models/queries");

const getIndex = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    res.render("index", {names});
}

const getCategory = async (req, res) => {

    const categories = await db.getCategories(); 
    const names = categories.map(category => category.name); 

    const {category} = req.params;
    const rows = await db.getItems(category);
    const items = rows.map(row => row.itemname);

    res.render("index", {names, items})
}

module.exports = { getIndex, getCategory }; 