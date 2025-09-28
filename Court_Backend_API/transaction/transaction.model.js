const connection = require("../sqlDb/sqlDb.js");


//MARK:- Transaction Model

const transactionModal = {
    createTransaction: async (transaction) => {
        const sql = "INSERT INTO transactions (user_id, package_id, payment_gateway_id, status, amount) VALUES (?, ?, ?, ?, ?)";
        try {
            const [result] = await connection.query(sql, [transaction.user_id, transaction.package_id, transaction.payment_gateway_id, transaction.status, transaction.amount]);
            return result;
        } catch (error) {
            console.error("🔥 Error in createTransaction:", error.message);
            throw new Error("Database error while creating transaction");
        }
    },

    //MARK:- Get Transactions for a User
  async getTransactionsForUser(user_id, limit = 10, offset = 0) {
    const sql = `
        SELECT id, user_id, amount, status, created_at 
        FROM transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?`;

    try {
        limit = Number(limit);
        offset = Number(offset);

        if (!user_id) {
            throw new Error("User ID is required");
        }
        
        if (isNaN(limit) || isNaN(offset)) {
            throw new Error("Invalid limit or offset value");
        }

        const [result] = await connection.query(sql, [user_id, limit, offset]);
        return result;
    } catch (error) {
        console.error("🔥 Error in getTransactionsForUser:", error.stack || error.message);
        throw new Error("Database error while getting transactions for user");
    }
},

    
    // MARK: - Get All Transactions
    async getAllTransactions(limit = 10, offset = 0) {
        const sql = `
                SELECT t.id, t.user_id, t.amount, t.status, t.created_at , u.first_name, u.last_name, u.email
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                ORDER BY t.created_at DESC 
                LIMIT ? OFFSET ?`;
            
        
        try {
            limit = Number(limit);
            offset = Number(offset);
    
            if (isNaN(limit) || isNaN(offset)) {
                throw new Error("Invalid limit or offset value");
            }
    
            const [result] = await connection.query(sql, [limit, offset]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getAllTransactions:", error.stack || error.message);
            throw new Error("Database error while getting all transactions");
        }
    },

    //MARK:- create the member ship for user
    async createMembership(user_id, package_id,message_limit, transaction_id) {
        
        const packageDetails = await this.getPackageById(package_id);
        if (!packageDetails) {
            throw new Error("Package not found");
        }
    
        
        if (typeof packageDetails.duration_days !== 'number' || packageDetails.duration_days < 0) {
            throw new Error("Invalid package duration");
        }
    
        // Calculate end date
        const start_date = new Date(); 
        const end_date = new Date(start_date);
        end_date.setDate(start_date.getDate() + packageDetails.duration_days);
    
        const sql = `
           INSERT INTO user_subscriptions 
(user_id, package_id, transaction_id, message_limit, start_date, end_date, numbers_used, is_active, created_at) 
VALUES (?, ?, ?, ?, ?, ?, 0, 1, NOW())

        `;
        try {
            const [result] = await connection.query(sql, [
                user_id,
                package_id,
                transaction_id, 
                message_limit,  
                start_date,
                end_date
            ]);
            
            return result;
        } catch (error) {
            console.error("🔥 Error in createMembership:", error.message);
            throw new Error("Database error while creating membership");
        }
    },
 

    //get the last membership for a user 

    async getLastMembershipForUser(user_id) {
        const sql = `
            SELECT 
                s.*, 
                p.id AS phone_id, 
                p.number AS phone_number,
                p.party_name,
                pkg.id AS package_id,
                pkg.name AS package_name,
                pkg.description AS package_description,
                pkg.phone_number_limit AS package_phone_number_limit,
               
                pkg.duration_days AS package_duration_days,
                pkg.amount AS package_amount,
                pkg.message_limit AS package_message_limit,
                pkg.is_active AS package_is_active,
                s.numbers_used AS numbers_used,  -- Added numbers_used
                s.messages_sent AS messages_sent,
                pkg.created_at AS package_created_at,
                pkg.updated_at AS package_updated_at
            FROM user_subscriptions s 
            LEFT JOIN phone_numbers p ON s.id = p.subscription_id 
            LEFT JOIN packages pkg ON s.package_id = pkg.id
            WHERE s.user_id = ? 
            AND s.id = (SELECT MAX(id) FROM user_subscriptions WHERE user_id = ?) 
            ORDER BY s.id DESC;
        `;
    
        try {
            const [rows] = await connection.query(sql, [user_id, user_id]);

            console.log(rows);
    
            if (rows.length === 0) return null;
    
            const membership = {
                id: rows[0].id,
                user_id: rows[0].user_id,
                subscription_type: rows[0].subscription_type, 
                numbers_used: rows[0].numbers_used,  // ✅ Included numbers_used
                phone_numbers: [],
                package: {
                    id: rows[0].package_id,
                    name: rows[0].package_name,
                    description: rows[0].package_description,
                    phone_number_limit: rows[0].package_phone_number_limit,
                    duration_days: rows[0].package_duration_days,
                    amount: rows[0].package_amount,
                    message_limit: rows[0].package_message_limit,
                    messages_sent: rows[0].messages_sent,   
                    is_active: rows[0].package_is_active,
                    created_at: rows[0].package_created_at,
                    updated_at: rows[0].package_updated_at
                }
            };
    
            membership.phone_numbers = rows
                .filter(row => row.phone_id !== null) 
                .map(row => ({
                    id: row.phone_id,
                    number: row.phone_number,
                    party_name: row.party_name
                }));
    
            return membership;
        } catch (error) {
            console.error("🔥 Error in getLastMembershipForUser:", error.message);
            throw new Error("Database error while getting last membership for user");
        }
    }
    
    

    
    ,
    
    
    async getPackageById(package_id) {
        const sql = "SELECT * FROM packages WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [package_id]);
            if (result.length === 0) {
                throw new Error("Package not found");
            }
            return result[0]; // Return the first (and only) result
        } catch (error) {
            console.error("🔥 Error in getPackageById:", error.message);
            throw new Error("Database error while fetching package details");
        }
    },
    async updateFreePnaStatus(user_id) {
        const sql = "UPDATE users SET free_trial = 1 WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [user_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in updateFreePnaStatus:", error.message);
            throw new Error("Database error while updating free_pna status");
        }
    },

    async getUserById(user_id){
        const sql = "SELECT * FROM users WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [user_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getUserById:", error.message);
            throw new Error("Database error while fetching user by id");
        }
    }




}
module.exports=transactionModal
