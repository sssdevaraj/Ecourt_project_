const connection = require('../sqlDb/sqlDb')

const mobileMaintainanceModel = {
    async createOne(data) {
        const { subscription_id, mobile_number,party_name } = data;

        const subscriptionQuery = `
            SELECT us.numbers_used, p.phone_number_limit 
            FROM user_subscriptions us
            JOIN packages p ON us.package_id = p.id
            WHERE us.id = ? AND us.is_active = TRUE;
        `;

        try {
            // Get Subscription Info
            const [subscription] = await connection.query(subscriptionQuery, [subscription_id]);

            if (!subscription || subscription.length === 0) {
                throw new Error("Subscription not found or inactive.");
            }

            const { numbers_used, phone_number_limit } = subscription[0];

            // Check Package Limit
            if (numbers_used >= phone_number_limit) {
                throw new Error("Phone number limit reached for this subscription.");
            }

            // Check if the number already exists for this subscription
            const checkNumberQuery = `
                SELECT id FROM phone_numbers 
                WHERE subscription_id = ? AND number = ?;
            `;
            const [existingNumber] = await connection.query(checkNumberQuery, [subscription_id, mobile_number]);

            if (existingNumber.length > 0) {
                throw new Error("Mobile number already exists for this subscription.");
            }

            // Insert Number
            const insertNumberQuery = `
                INSERT INTO phone_numbers (subscription_id, number ,party_name) 
                VALUES (?, ?, ?);
            `;
            const [insertResult] = await connection.query(insertNumberQuery, [subscription_id, mobile_number, party_name]);

            // Update Subscription Usage
            const updateSubscriptionQuery = `
                UPDATE user_subscriptions 
                SET numbers_used = numbers_used + 1 
                WHERE id = ?;
            `;
            await connection.query(updateSubscriptionQuery, [subscription_id]);

            return insertResult;


        } catch (error) {
            console.error("🔥 Error in createOne:", error.message);
            throw new Error(error.message || "Database error while creating one");
        }
    },

    async getSubscriptionById(subscription_id) {
        const sql = "SELECT * FROM user_subscriptions WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [subscription_id]);
           
            return result[0];
        } catch (error) {
            console.error("🔥 Error in getSubscriptionById:", error.message);
            throw new Error("Database error while fetching subscription details");
        }
    } ,

    async checkPackageLimit(subscription_id) {
        const query = `
            SELECT us.numbers_used, p.phone_number_limit 
            FROM user_subscriptions us
            JOIN packages p ON us.package_id = p.id
            WHERE us.id = ?;
        `;
        const [result] = await connection.query(query, [subscription_id]);
        if (result.length === 0) {
            throw new Error("Subscription not found or inactive.");
        }
        const { numbers_used, phone_number_limit } = result[0];
        return numbers_used >= phone_number_limit; 
    }
    ,

    async deleteOne(data) {
        const { subscription_id, mobile_number } = data;
        const sql = "DELETE FROM phone_numbers WHERE subscription_id = ? AND number = ?";
        try {
            const [result] = await connection.query(sql, [subscription_id, mobile_number]);

            const updateSubscriptionQuery = `
                UPDATE user_subscriptions 
                SET numbers_used = numbers_used - 1 
                WHERE id = ?;
            `;
            await connection.query(updateSubscriptionQuery, [subscription_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in deleteOne:", error.message);
            throw new Error("Database error while deleting one");
        }
       

    }
    
    
}

module.exports = mobileMaintainanceModel;