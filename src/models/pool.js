const { Pool } = require('pg');

module.exports = new Pool({
    user: process.env.USERNAME, 
    password: process.env.PASSWORD, 
    host: process.env.HOST, 
    port: process.env.DBPORT, 
    database: process.env.DATABASE
});