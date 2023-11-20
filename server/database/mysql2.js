// db.js

const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  port:'3306',
  user: 'vansoKenya',
  password: 'rootme',
  database: 'adminUsers',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

module.exports = pool.promise(); // Use promise() to enable async/await syntax
