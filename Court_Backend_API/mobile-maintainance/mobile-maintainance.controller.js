const mobileMaintainanceModel = require('./mobile-maintainance.model');

const MobileMaintenanceController = {
    async postNumber(req, res) {
        try {
            const { subscription_id, mobile_number, party_name } = req.body;

            
    
           
            if (!subscription_id || !mobile_number) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Validation failed: 'subscription_id' and 'mobile_number' are required fields." 
                });
            }
    
            // Check if the subscription exists
            const subscription = await mobileMaintainanceModel.getSubscriptionById(subscription_id);
            if (!subscription) {
                throw new Error("SUBSCRIPTION_NOT_FOUND");
            }
    
            // Check if the subscription is active
            if (!subscription.is_active) {
                throw new Error("SUBSCRIPTION_INACTIVE");
            }
    
            // Check if the package limit is reached
            const packageLimitReached = await mobileMaintainanceModel.checkPackageLimit(subscription_id);
            if (packageLimitReached) {
                throw new Error("PACKAGE_LIMIT_REACHED");
            }
    
            // Create the phone number
            const number = await mobileMaintainanceModel.createOne({ subscription_id, mobile_number,party_name });
            if (!number) {
                throw new Error("NUMBER_CREATION_FAILED");
            }
    
            return res.status(201).json({ 
                status: true, 
                message: `Phone number ${mobile_number} has been successfully added.` 
            });
    
        } catch (error) {
            console.error("🔥 Error in postNumber:", error.message);
    
            let statusCode = 500;
            let message = "Something went wrong. Please try again later.";
    
            switch (error.message) {
                case "SUBSCRIPTION_NOT_FOUND":
                    statusCode = 404;
                    message = `Subscription ID ${subscription_id} not found.`;
                    break;
    
                case "SUBSCRIPTION_INACTIVE":
                    statusCode = 400;
                    message = `Subscription ID ${subscription_id} is inactive. Please activate or renew your subscription.`;
                    break;
    
                case "PACKAGE_LIMIT_REACHED":
                    statusCode = 400;
                    message = `The package has reached its phone number limit. Upgrade required.`;
                    break;
    
                case "Mobile number already exists for this member.":
                    statusCode = 409;
                    message = `The mobile number ${mobile_number} is already registered under subscription ID ${subscription_id}.`;
                    break;
    
                case "NUMBER_CREATION_FAILED":
                    statusCode = 500;
                    message = `An error occurred while saving mobile number ${mobile_number} for subscription ID ${subscription_id}. Please try again.`;
                    break;
    
                default:
                    message = `${error.message}.`;
            }
    
            return res.status(200).json({ status: false, message });
        }
    },

    //MARK:- delete number on subscription id 
    async deleteNumber(req, res) {
        try {
            const { subscription_id, mobile_number } = req.body;
    
            // Check if the subscription exists
            const subscription = await mobileMaintainanceModel.getSubscriptionById(subscription_id);
            if (!subscription) {
                throw new Error("SUBSCRIPTION_NOT_FOUND");
            }
    
            // Check if the subscription is active
            if (!subscription.is_active) {
                throw new Error("SUBSCRIPTION_INACTIVE");
            }
    
            // Delete the phone number
            const number = await mobileMaintainanceModel.deleteOne({ subscription_id, mobile_number });
            if (!number) {
                throw new Error("NUMBER_DELETION_FAILED");
            }
    
            return res.status(200).json({ 
                status: true, 
                message: `Phone number ${mobile_number} has been successfully deleted.` 
            });
    
        } catch (error) {
            console.error("🔥 Error in deleteNumber:", error.message);
    
            let statusCode = 500;
            let message = "Something went wrong. Please try again later.";
    
            switch (error.message) {
                case "SUBSCRIPTION_NOT_FOUND":
                    statusCode = 404;
                    message = ` not found.`;
                    break;
    
                case "SUBSCRIPTION_INACTIVE":
                    statusCode = 400;
                    message = `Subscription ID  is inactive. Please activate or renew your subscription.`;
                    break;
    
                case "NUMBER_DELETION_FAILED":
                    statusCode = 500;   
                    message = `An error occurred while deleting mobile number ${mobile_number} for subscription ID ${subscription_id}. Please try again.`;
                    break;  
    
                default:
                    message = `${error.message}.`;
            }
    
            return res.status(statusCode).json({ status: false, message });
        }
    }
    
}

module.exports = MobileMaintenanceController;