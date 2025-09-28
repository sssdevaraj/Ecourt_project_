const ComplaintsModal = require('./complaints.model.js')

const complaintsController = {

    //MARK:Post complain on user id 
    async postComplain(req, res) {
        try {
            const { user_id, topic, message, status } = req.body;
            if(!topic || !message || !user_id) return res.status(200).json({ status: false, message: "All fields are required" });

            // going to create the complain
            const complain = await ComplaintsModal.createComplaint({ user_id, topic, message, status })
            if(!complain) return res.status(200).json({ status: false, message: "Something went wrong",  });

            return res.status(200).json({ status: true, message: "Complain created successfully" })   
            
            
        } catch (error) {
            console.error("Error in postComplain:", error);
            res.status(200).json({ status: false, message: "Something went wrong" });
        }
    },

    //MARK:- Get complaints on user id
    async getComplaintsOnUserId(req, res) {
        try {
            const { user_id } = req.params;
            if(!user_id) return res.status(200).json({ status: false, message: "All fields are required" });

            // going to create the complain
            const complain = await ComplaintsModal.getByuserId(user_id)
            if(!complain) return res.status(200).json({ status: false, message: "Something went wrong", data: [] });

            return res.status(200).json({ status: true, message: "Complain fetched successfully", complain })
            
        } catch (error) {
            console.error("Error in getComplaintsOnUserId:", error);
            res.status(200).json({ status: false, message: "Something went wrong", data: [] });
        }
    },

    //MARK:- verify complain
    async verifyComplain (req, res){
        try {
            const { complain_id, status} = req.body;
            if(!complain_id || !status) return res.status(200).json({ status: false, message: "All fields are required" });
            
            const complain = await ComplaintsModal.verifyComplain(complain_id, status)
            if(!complain) return res.status(200).json({ status: false, message: "Something went wrong",  });    

            return res.status(200).json({ status: true, message: "Complain verified successfully" })

        } catch (error) {
            console.error("Error in verifyComplain:", error);
            res.status(200).json({ status: false, message: "Something went wrong", }); 
        }

    },
    
    async getAllComplaints(req, res){

        try{
            const complainst = await ComplaintsModal.getAllComplaints()
            if(!complainst) return res.status(200).json({ status: false, message: "Something went wrong", data: [] });  

            return res.status(200).json({ status: true, message: "Complain fetched successfully", complainst })


        }catch{
            console.error("Error in getAllComplaints:", error);
            res.status(200).json({ status: false, message: "Something went wrong", data: [] });

        }
    }

}

module.exports = complaintsController