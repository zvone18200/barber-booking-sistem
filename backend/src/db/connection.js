require('dotenv').config();
const { Pool } = require('pg');

console.log('Spajam se na bazu:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
});

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Greška:', err.message);
    } else {
        console.log('Baza spojena!', res.rows[0].now);
    }
});

module.exports = pool;