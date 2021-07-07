const { Pool } = require('pg');
const config = require('./config');

const configDB = {
    user: config.db_screen_inventory.user,
    host: config.db_screen_inventory.host,
    password: config.db_screen_inventory.password,
    database: config.db_screen_inventory.database
};

const configDB2 = {
    user: config.db_cms.user,
    host: config.db_cms.host,
    password: config.db_cms.password,
    database: config.db_cms.database
};
const pool = new Pool(configDB); // conexion  postgresql

console.log('conecto bbdd');

module.exports = {
    pool
}