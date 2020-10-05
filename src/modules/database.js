const { Pool } = require('pg');
const configDB = {
    user: 'postgres',
    host: 'localhost',
    password: '',
    database: 'screen_inventory'
};
const pool = new Pool(configDB); // conexion  postgresql

console.log('conecto bbdd');

module.exports = {
    pool
}