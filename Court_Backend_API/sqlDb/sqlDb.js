const mysql = require("mysql2/promise"); 
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


(async () => {
    try {
        const conn = await connection.getConnection();
        console.log("✅ MySQL Database Connected Successfully!");
        conn.release(); 
    } catch (error) {
        console.error("❌ MySQL Connection Failed:", error.message);
    }
})();

module.exports = connection;
