const pool = require("./pool.js"); 

async function getCategories() {
    const { rows } = await pool.query(`SELECT * FROM category`);
    return rows; 
}

async function getItems(withCategoryLabels=false) {

    const query = withCategoryLabels ? `SELECT category.name AS categoryname, item.name AS itemname, item.price FROM
    item LEFT JOIN category_item ON item.id = item_id LEFT JOIN category ON category_id = category.id` : `SELECT * FROM item`;

    const { rows } = await pool.query(query); 
    return rows; 
}

async function itemExists(item) {
    const { rows } = await pool.query(`SELECT * FROM item WHERE name=$1`, [item]);
    return rows.length === 0 ? false : true; 
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

    const query = `SELECT DISTINCT i.name AS itemname
    FROM item i
    LEFT JOIN category_item ci ON i.id = ci.item_id
    LEFT JOIN category c ON c.id = ci.category_id
    WHERE i.id NOT IN (
        SELECT ci2.item_id
        FROM category_item ci2
        RIGHT JOIN category c2 ON ci2.category_id = c2.id
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

    category = category.charAt(0).toUpperCase() + category.slice(1);

    const query = `INSERT INTO category (name) VALUES ($1)`;

    await pool.query(query, [category]);
}

async function addItem(item, category) {

    const { itemname, price } = item;
    category = category.charAt(0).toUpperCase() + category.slice(1);

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

async function deleteCategoryItem(category, item) {

    const query = `DELETE FROM category_item WHERE 
    category_id = (SELECT category.id FROM category WHERE category.name = $1) 
    AND item_id = (SELECT item.id FROM item WHERE item.name = $2)`;

    await pool.query(query, [category, item]);
}

module.exports = { getCategories, getItems, itemExists, getItemsOnCategory, 
    getItemsExceptCategory, getItem, addCategory, addItem, updateItem,
    deleteCategoryItem };