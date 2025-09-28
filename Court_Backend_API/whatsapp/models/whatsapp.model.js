const sqlDb = require("../../sqlDb/sqlDb.js");

const whatsappModel = {
    // Get user phone numbers
    async getPhoneNumbers(user_id) {
        const sql = `
            SELECT s.id, p.number 
            FROM user_subscriptions s 
            JOIN phone_numbers p ON s.id = p.subscription_id
            WHERE s.user_id = ? 
            AND s.id = (
                SELECT id FROM user_subscriptions 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            );
        `;
        const [result] = await sqlDb.query(sql, [user_id, user_id]);
        return result.length > 0 ? result.map(row => ({ id: row.id, number: row.number })) : null;
    },

    // Get case details
    async getCaseDetails(case_ids, user_id) {
        if (!Array.isArray(case_ids) || case_ids.length === 0) {
            return null;
        }
    
        const placeholders = case_ids.map(() => "?").join(","); 
        const sql = `
            SELECT  * FROM cases c WHERE id IN (${placeholders})
            AND user_id = ?
        `;
    
        const params = [...case_ids, user_id]; 
        const [result] = await sqlDb.query(sql, params);
    
       
        return result.length > 0 ? result : null;
    }
    
};

module.exports = whatsappModel;
