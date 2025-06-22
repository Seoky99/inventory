const { Client } = require('pg'); 
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

console.log("client begin");

console.log({
    user: process.env.USERNAME, 
    password: process.env.PASSWORD, 
    host: process.env.HOST, 
    port: process.env.DBPORT, 
    database: process.env.DATABASE
});

const client = new Client( {
    user: process.env.USERNAME, 
    password: process.env.PASSWORD, 
    host: process.env.HOST, 
    port: process.env.DBPORT, 
    database: process.env.DATABASE
})

console.log("client end");

const query = `
    CREATE TABLE IF NOT EXISTS category(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 255 )
    );

    CREATE TABLE IF NOT EXISTS item(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 255 ),
        price DECIMAL,
        isCombo BOOLEAN
    ); 

    CREATE TABLE IF NOT EXISTS category_item(
        category_id INTEGER,
        item_id INTEGER,
        PRIMARY KEY (category_id, item_id),

        CONSTRAINT catconstraint
            FOREIGN KEY (category_id)
            REFERENCES category(id)
            ON DELETE CASCADE,

        CONSTRAINT itemconstraint 
            FOREIGN KEY (item_id)
            REFERENCES item(id)
            ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS combo_component(
        combo_id INTEGER,
        item_id INTEGER,    
        quantity INTEGER DEFAULT 1, 
        PRIMARY KEY(combo_id, item_id),
        CONSTRAINT comboconstraint
            FOREIGN KEY (combo_id)
            REFERENCES item(id)
            ON DELETE CASCADE,
        CONSTRAINT comboidconstraint
            FOREIGN KEY (item_id)
            REFERENCES item(id)
            ON DELETE CASCADE 
    );  

 INSERT INTO item (name, price, isCombo)
    VALUES
    ('Summer Burger', 7.50, false),
    ('Royal Red Burger', 9.25, false),
    ('Southwest Burger', 12.50, false),
    ('Chicken Burger', 6.00, false),
    ('Classic Burger', 7.50, false),
    ('Fries', 2.50, false),
    ('Steak Fries', 2.75, false),
    ('Curly Fries', 3.00, false),
    ('Vanilla Shake', 2.50, false),
    ('Strawberry Shake', 2.75, false),
    ('Mint Shake', 3.00, false),
    ('Classic Combo', 10.00, true),
    ('Summer Combo', 11.00, true);

    INSERT INTO category (name) 
    VALUES ('Combos'), ('Specials'), ('Burgers'), ('Fries'), ('Shakes');

    INSERT INTO combo_component (combo_id, item_id, quantity)
    VALUES 
        ((SELECT id FROM item WHERE name = 'Classic Combo'),
        (SELECT id FROM item WHERE name = 'Classic Burger'),
        1),
        ((SELECT id FROM item WHERE name = 'Classic Combo'),
        (SELECT id FROM item WHERE name = 'Fries'),
        1),
        ((SELECT id FROM item WHERE name = 'Classic Combo'),
        (SELECT id FROM item WHERE name = 'Vanilla Shake'),
        1),
        ((SELECT id FROM item WHERE name = 'Summer Combo'),
        (SELECT id FROM item WHERE name = 'Summer Burger'),
        1),
        ((SELECT id FROM item WHERE name = 'Summer Combo'),
        (SELECT id FROM item WHERE name = 'Curly Fries'),
        1),
        ((SELECT id FROM item WHERE name = 'Summer Combo'),
        (SELECT id FROM item WHERE name = 'Strawberry Shake'),
        1);
    
    INSERT INTO category_item (category_id, item_id)
    VALUES 
        ((SELECT category.id FROM category WHERE category.name = 'Specials'),
        (SELECT item.id FROM item WHERE item.name = 'Summer Burger')),
        ((SELECT category.id FROM category WHERE category.name = 'Specials'),
        (SELECT item.id FROM item WHERE item.name = 'Summer Combo')),
    
        ((SELECT category.id FROM category WHERE category.name = 'Shakes'),
        (SELECT item.id FROM item WHERE item.name = 'Vanilla Shake')),
        ((SELECT category.id FROM category WHERE category.name = 'Shakes'),
        (SELECT item.id FROM item WHERE item.name = 'Strawberry Shake')),
        ((SELECT category.id FROM category WHERE category.name = 'Shakes'),
        (SELECT item.id FROM item WHERE item.name = 'Mint Shake')),

        ((SELECT category.id FROM category WHERE category.name = 'Fries'),
        (SELECT item.id FROM item WHERE item.name = 'Fries')),
        ((SELECT category.id FROM category WHERE category.name = 'Fries'),
        (SELECT item.id FROM item WHERE item.name = 'Steak Fries')),
        ((SELECT category.id FROM category WHERE category.name = 'Fries'),
        (SELECT item.id FROM item WHERE item.name = 'Curly Fries')),

        ((SELECT category.id FROM category WHERE category.name = 'Burgers'),
        (SELECT item.id FROM item WHERE item.name = 'Summer Burger')),
        ((SELECT category.id FROM category WHERE category.name = 'Burgers'),
        (SELECT item.id FROM item WHERE item.name = 'Royal Red Burger')),
        ((SELECT category.id FROM category WHERE category.name = 'Burgers'),
        (SELECT item.id FROM item WHERE item.name = 'Southwest Burger')),
        ((SELECT category.id FROM category WHERE category.name = 'Burgers'),
        (SELECT item.id FROM item WHERE item.name = 'Chicken Burger')),
        ((SELECT category.id FROM category WHERE category.name = 'Burgers'),
        (SELECT item.id FROM item WHERE item.name = 'Classic Burger')),

        ((SELECT category.id FROM category WHERE category.name = 'Combos'),
        (SELECT item.id FROM item WHERE item.name = 'Classic Combo')),
        ((SELECT category.id FROM category WHERE category.name = 'Combos'),
        (SELECT item.id FROM item WHERE item.name = 'Summer Combo'));`;

async function populateDB() {

    try {
        console.log("connecting");

        await client.connect(); 

        console.log("connecting finish");

        await client.query(query);
        console.log("done query");
    } catch (err) {
        console.log(err); 
    } finally {
        await client.end(); 
    }
}

populateDB(); 