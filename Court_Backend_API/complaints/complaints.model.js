const connection = require('../sqlDb/sqlDb.js')

const ComplaintsModal = {
    //MARK:- Create Complaint
    async createComplaint(complaint){
        const sql = "INSERT INTO complaints (user_id, topic, message) VALUES (?, ?, ?)";
        try {
            const [result] = await connection.query(sql, [complaint.user_id, complaint.topic, complaint.message]);
            return result;
        } catch (error) {
            console.error("🔥 Error in createComplaint:", error.message)    
            throw new Error("Database error while creating complaint");
        }   
    },

    //MARK:- Get Complaints on user id
    async getByuserId(user_id){
        const sql = "SELECT * FROM complaints WHERE user_id = ?";
        try {
            const [result] = await connection.query(sql, [user_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getComplaintsOnUserId:", error.message);
            throw new Error("Database error while getting complaints on user id");
        }
    },

    //MARK:- verify complaint
    async verifyComplain(complain_id, status){
        const sql = "UPDATE complaints SET status = ? WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [status, complain_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in verifyComplain:", error.message) 
            throw new Error("Database error while verifying complain");
        }
    },

    //MARK:- Get complaints on user id
    async getAllComplaints(){
        const sql = `
        SELECT c.* , u.first_name, u.last_name, u.email 
        from complaints c JOIN users u ON c.user_id = u.id 
         ORDER BY id DESC`;

        try {
            const [result] = await connection.query(sql);
            return result
        }
        catch(error){
            console.error("🔥 Error in getAllComplaints:", error.message)  ;
            throw new Error("Database error while getting all complaints");
        }
    }

}

module.exports = ComplaintsModal