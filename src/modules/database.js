const { Pool } = require('pg');
const config = require('./config');

const configDB = {
    user: config.db.user,
    host: config.db.host,
    password: config.db.password,
    database: config.db.database
};

const pool = new Pool(configDB); // conexion  postgresql

console.log('conecto bbdd');

module.exports = {
    pool
}