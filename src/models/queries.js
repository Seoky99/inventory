const pool = require("./pool.js"); 

async function getCategories() {
    const { rows } = await pool.query(`SELECT * FROM category`);
    return rows; 
}

async function getItems() {
    const { rows } = await pool.query(`SELECT * FROM item`); 
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


async function getItemsExceptCategory(category) {

    category = category.charAt(0).toUpperCase() + category.slice(1);

    const query = `SELECT c.name AS categoryname, i.name AS itemname
    FROM item i
    JOIN category_item ci ON i.id = ci.item_id
    JOIN category c ON c.id = ci.category_id
    WHERE i.id NOT IN (
        SELECT ci2.item_id
        FROM category_item ci2
        JOIN category c2 ON ci2.category_id = c2.id
        WHERE c2.name = $1
    );`;

    const { rows } = await pool.query(query, [category]); 
    return rows; 
}

async function getItem(item) {
    const query = `SELECT name, price FROM item WHERE name = $1`;
    
    const { rows } = await pool.query(query, [item]); 
    return rows; 
}

async function addCategory(category) {
    const query = `INSERT INTO category (name) VALUES ($1)`;

    await pool.query(query, [category]);
}

async function addItem(item, category) {

    const { itemname, price } = item;

    const query = `INSERT INTO item (name, price) VALUES ($1, $2)`;
    const catQuery = `INSERT INTO category_item (category_id, item_id) VALUES (
        (SELECT id FROM category WHERE name=$1), 
        (SELECT id FROM item WHERE name=$2)
    ) `; 

    await pool.query(query, [itemname, price]);
    await pool.query(catQuery, [category, itemname]);
}

async function updateItem(category, itemToUpdate) {

    const query = `INSERT INTO category_item VALUES (
        (SELECT category.id FROM category WHERE category.name = $1), 
        (SELECT item.id FROM item WHERE item.name = $2)
    )`;

    await pool.query(query, [category, itemToUpdate]); 
}

module.exports = { getCategories, getItems, getItemsOnCategory, getItemsExceptCategory, getItem, addCategory, addItem, updateItem };