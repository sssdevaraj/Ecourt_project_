const connection = require("./sqlDb/sqlDb.js");

const logModel = {
    async createLog(data) {
        const sql = `INSERT INTO logs (user_id, event, description) VALUES (?, ?, ?)`;

        try {
            const [result] = await connection.query(sql, [data.user_id, data.event, data.description]);
            return result;
        } catch (error) {
            console.error("🔥 Error in createLog:", error.message);
            throw new Error("Database error while saving log");
        }
    }
};

module.exports = logModel;