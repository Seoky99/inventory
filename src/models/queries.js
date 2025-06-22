const pool = require("./pool.js"); 

async function getCategories() {
    const { rows } = await pool.query(`SELECT * FROM category`);
    return rows; 
}

async function getItems(category) {

    category = category.charAt(0).toUpperCase() + category.slice(1);

    const query = `SELECT category.name, item.name AS itemName, item.price 
    FROM category 
    INNER JOIN category_item ON category_id = category.id 
    INNER JOIN item ON item_id = item.id 
    WHERE category.name = $1
    ORDER BY item.id`;

    const { rows } = await pool.query(query, [category]); 
    return rows; 
}

module.exports = { getCategories, getItems };