const connection = require('../sqlDb/sqlDb.js');

const workerModel = {
    async getLimitForUser(user_id) {
        console.log(user_id)
        const sql = `
            SELECT 
                s.id AS subscription_id,
                u.first_name,
                pkg.message_limit AS package_message_limit,
                pkg.is_active AS package_is_active,
                IFNULL(s.messages_sent, 0) AS messages_sent
            FROM user_subscriptions s
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN packages pkg ON s.package_id = pkg.id
            WHERE s.user_id = ? 
            AND s.id = (SELECT MAX(id) FROM user_subscriptions WHERE user_id = ?) 
            ORDER BY s.id DESC;
        `;

        try {
            const [rows] = await connection.query(sql, [user_id, user_id]);
            if (rows.length === 0) return null;
            return {
                subscription_id: rows[0].subscription_id,
                first_name: rows[0].first_name,
                package: {
                    message_limit: parseInt(rows[0].package_message_limit, 10),
                    is_active: rows[0].package_is_active,
                    messages_sent: parseInt(rows[0].messages_sent, 10),
                }
            };
        } catch (error) {
            console.error("🔥 Error in getLimitForUser:", error.message);
            throw new Error("Database error while getting user message limit");
        }
    },

    /**
 * Increment messages_sent for a subscription (reduce available message limit)
 * @param {number} subscription_id 
 */
    async  decrementMessageLimit(subscription_id) {
        const sql = `
            UPDATE user_subscriptions 
            SET messages_sent = COALESCE(messages_sent, 0) + 1  
            WHERE id = ?;
        `;
    
        try {
            const [result] = await connection.query(sql, [subscription_id]);
            
            if (result.affectedRows === 0) {
                console.warn(`⚠️ No rows updated for subscription ID: ${subscription_id}`);
            } else {
                console.log(`📊 Decremented message limit for subscription ID: ${subscription_id}`);
            }
    
        } catch (error) {
            console.error("🔥 Error decrementing message limit:", error.message);
            throw new Error("Database error while decrementing message limit");
        }
    }
    
};

module.exports = workerModel;
