const pool = require("./pool.js"); 

async function getCategories() {
    const { rows } = await pool.query(`SELECT * FROM category`);
    return rows; 
}

async function getItemsOnCategory(category) {

    category = category.charAt(0).toUpperCase() + category.slice(1);

    const query = `SELECT category.name AS categoryname, item.name AS itemname, item.price 
    FROM category 
    INNER JOIN category_item ON category_id = category.id 
    INNER JOIN item ON item_id = item.id 
    WHERE category.name = $1
    ORDER BY item.id`;

    const { rows } = await pool.query(query, [category]); 
    return rows; 
}

async function getItem(item) {

    const query = `SELECT name, price FROM item WHERE name = $1`;
    
    const { rows } = await pool.query(query, [item]); 
    return rows; 
}

module.exports = { getCategories, getItemsOnCategory, getItem };