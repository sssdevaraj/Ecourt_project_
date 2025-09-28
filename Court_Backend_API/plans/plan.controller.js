const planModel = require("./plan.model.js")
const planController={
    //MARK:get al plans
    async getPlans(req, res){
        try {
            const plans = await planModel.getPlans()
            if(!plans)return res.json({status : false, message :"Error fetching plans", plans: []})
 
            res.status(200).json({status: true, message: "Plans fetched successfully", plans})
        } catch (error) {
            console.error("Error in getPlans:", error);
            res.status(200).json({status: false, message: "Something went wrong", data: [] });
        }
    }
}
module.exports= planController