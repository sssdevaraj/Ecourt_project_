const connection = require("../sqlDb/sqlDb.js");

//MARK:- FeedBack Model

const FeedbackModal = {

    //MARK:- Create FeedBack
    async createFeedBack(feedBack){
      
        const sql = "INSERT INTO feedbacks (user_id, topic, message) VALUES (?, ?, ?)";
        try {
            const [result] = await connection.query(sql, [feedBack.user_id, feedBack.topic, feedBack.message]);
            return result;
        } catch (error) {
            console.error("🔥 Error in createFeedBack:", error.message);
            throw new Error("Database error while creating feedback");
        }
    
    },

    //MARK:- Get FeedBack on user_id
    async getFeedbackOnUserId(user_id){
        const sql = "SELECT * FROM feedbacks WHERE user_id = ?";
        try {
            const [result] = await connection.query(sql, [user_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getFeedbackOnUserId:", error.message);
            throw new Error("Database error while getting feedback on user id");
        }
    },

    //MARK:- Admin Feedbacks
    async adminFeedbacks(){
        const sql =  `SELECT f.*, u.first_name, u.last_name , u.email FROM feedbacks f join users u on f.user_id= u.id ORDER BY id DESC`;
        try {
            const [result] = await connection.query(sql);
            return result;
        } catch (error) {
            console.error("🔥 Error in adminFeedbacks:", error.message);
            throw new Error("Database error while getting admin feedbacks");
        }
    }

}

module.exports = FeedbackModal