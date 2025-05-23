const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  namedPlaceholders: true,
});

// Add connection testing
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");

    // Test query
    const [result] = await connection.query("SELECT 1");
    console.log("Database connection test query successful");

    connection.release();
  } catch (err) {
    console.error("Database connection error:", {
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      message: err.message,
    });
    throw err;
  }
};

// Test connection on startup
testConnection().catch(console.error);

module.exports = { pool };
