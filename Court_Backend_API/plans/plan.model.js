const connection = require("../sqlDb/sqlDb.js");    



const planModel = {
    async getPlans(){
        const sql = "SELECT * FROM packages";
        try {
            const [result] = await connection.query(sql);
            return result;
        } catch (error) {
            console.error("🔥 Error in getPlans:", error.message);
            throw new Error("Database error while getting plans");
        }
    }
}
module.exports = planModel