'use strict';
/*const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
*/

const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Connection to db failed', err);
  }
})();

module.exports = mongoose.connection;
