//MARK:- Transaction Controller
const transactionModal = require('./transaction.model.js');


const transactionController = {
    //MARK:- Create Transaction
    async createTransaction(req, res) {
        try {
            const { user_id, package_id, payment_gateway_id, status, amount } = req.body;
    
            if (!user_id || !package_id || !payment_gateway_id || !status || !amount) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
    
            // Fetch package details
            const package = await transactionModal.getPackageById(package_id);
            if (!package) {
                return res.status(404).json({ status: false, message: "Package not found" });
            }
    
            // Checking  for free trial plan
            if (package.name === "Trial Plan") {
                const user = await transactionModal.getUserById(user_id);

                if (!user) {
                    return res.status(404).json({ status: false, message: "User not found" });
                }

                if (user[0].free_trial === 1) {
                    return res.status(400).json({ status: false, message: "You already   used a free plan" });
                }
    
                await transactionModal.updateFreePnaStatus(user_id);
            }
    
          
            if (!["SUCCESS", "FAILED"].includes(status)) {
                return res.status(400).json({ status: false, message: "Invalid transaction status" });
            }
    
            // Create transaction
            const transaction = await transactionModal.createTransaction({
                user_id,
                package_id,
                payment_gateway_id,
                status,
                amount
            });
    
            if (!transaction || !transaction.insertId) {
                return res.status(500).json({ status: false, message: "Transaction creation failed" });
            }
    
            // Create membership for successful transactions
            if (status === "SUCCESS") {
                const membershipCreated = await transactionModal.createMembership(user_id, package_id, package.message_limit, transaction.insertId);
                if (!membershipCreated) {
                    return res.status(500).json({ status: false, message: "Membership creation failed" });
                }
            }
    
            return res.status(201).json({ 
                status: true, 
                message: "Transaction processed successfully",
                transactionId: transaction.insertId 
            });
    
        } catch (error) {
            console.error("Error in createTransaction:", error);
            res.status(500).json({ 
                status: false, 
                message: error.message || "Transaction processing failed" 
            });
        }
    },
    

    //MARK:- Get Transactions for a User (with pagination)
    async getTransactionsForUser(req, res) {
        try {
            const { user_id } = req.params;
            const { page = 1, limit = 10 } = req.query; 

            // Validate user_id
            if (!user_id) {
                return res.status(400).json({ status: false, message: "User ID is required" });
            }

            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            // Get transactions for the user with pagination
            const transactions = await transactionModal.getTransactionsForUser(user_id, limit, offset);

            return res.status(200).json({
                status: true,
                message: "Transactions retrieved successfully",
                data: transactions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: transactions.length 
                }
            });

        } catch (error) {
            console.error("Error in getTransactionsForUser:", error);
            res.status(500).json({ 
                status: false, 
                message: error.message || "Failed to retrieve transactions" 
            });
        }
    },

    //MARK:- Get All Transactions (with pagination) - Admin Panel
    async getAllTransactions(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query; 

            // Calculate offset for pagination
            const offset = (page - 1) * limit;

            
            const transactions = await transactionModal.getAllTransactions(limit, offset);

            return res.status(200).json({
                status: true,
                message: "All transactions retrieved successfully",
                data: transactions,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: transactions.length 
                }
            });

        } catch (error) {
            console.error("Error in getAllTransactions:", error);
            res.status(500).json({ 
                status: false, 
                message: error.message || "Failed to retrieve transactions" 
            });
        }
    },

    //MARK:- Get Last Membership for a User
    async getLastMembershipForUser(req, res) {
        try {
            const { user_id } = req.params;
    
         
            if (!user_id) {
                return res.status(400).json({ status: false, message: "User ID is required" });
            }
    
          
            const membership = await transactionModal.getLastMembershipForUser(user_id);
            console.log("membership",membership);
    
           
            if (!membership) {
                return res.status(404).json({ status: false, message: "No membership found for this user" });
            }
    
            return res.status(200).json({
                status: true,
                message: "Last membership retrieved successfully",
                data: membership
            });
    
        } catch (error) {
            console.error("🔥 Error in getLastMembershipForUser:", error);
            res.status(500).json({ 
                status: false, 
                message: "Failed to retrieve last membership",
                error: error.message 
            });
        }
    }
    
};

module.exports = transactionController;