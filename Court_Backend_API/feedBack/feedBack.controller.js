const FeedbackModal = require("./feedBack.model.js")
const { get } = require("./feedBack.routes.js")
const FeedbackController = {
    //MARK:- post feedBack
    async postFeedBack(req, res){
        try {
            const {user_id, topic, message} = req.body
            if(!user_id || !topic || !message) return res.status(200).json({status: false, message: "All fields are required",})

            // going to create the feedback
            const feedback = await FeedbackModal.createFeedBack({user_id, topic, message})
            if(!feedback) return res.status(200).json({status: false, message: "Something went wrong",})

            return res.status(200).json({status: true, message: "Feedback created successfully", })

        } catch (error) {
            return res.json({status: false, message: "Something went wrong"})
            
        }
       
    },

    //MARK:- get feedBack based on user id
    async getFeedbackOnUserId  (req, res){
        const {user_id} = req.params;

        try {
            const feedback = await FeedbackModal.getFeedbackOnUserId(user_id)
            if(!feedback) return res.status(200).json({status: false, message: "Something went wrong", data : []})

            return res.status(200).json({status: true, message: "Feedback fetched successfully", feedback})

        } catch (error) {
            return res.status(200).json({status: false, message: "Something went wrong", data : []})
            
        }

        
    },

    //MARK:- get all feedback
    async adminFeedbacks(req, res){
        try {
            const feedback = await FeedbackModal.adminFeedbacks()
            if(!feedback) return res.status(200).json({status: false, message: "Something went wrong", data : []})

            return res.status(200).json({status: true, message: "Feedback fetched successfully", feedback})

        } catch (error) {
            return res.status(200).json({status: false, message: "Something went wrong", data : []})
            
        }
    }   
   
}

module.exports=FeedbackController