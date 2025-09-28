const axios = require("axios");
const CaseModel = require("../cases/cases.model.js");
const LogModel = require("../logModel.js");
const redisClient = require('../sqlDb/redisKV.js');
require('dotenv').config();



const caseController = {
    async saveAndValidateCase(req, res) {
        try {
            const { user_id, state, district, court_complex, case_type, case_date, case_number, cnr_number, party_name, next_date, court_establishment } = req.body;
    
            // Step 1: Check if the case already exists for the user
            const existingCase = await CaseModel.getCaseByUserAndCNR(user_id, cnr_number);
            console.log("existingCase", existingCase);
            
            if (existingCase) {
                await LogModel.createLog({
                    user_id: user_id,
                    event: 'Case Duplication Attempt',
                    description: `User ${user_id} attempted to add a duplicate case with CNR ${cnr_number}`,
                });
                return res.status(400).json({ status: false, message: "Case already exists for this user" });
            }
    
            // Step 2: Call the real API to validate the case
            let apiResponse;
            try {
                const apiUrl = process.env.API_URL;
                const headers = {
                    Authorization:`Bearer ` +  process.env.API_TOKEN,
                    'Content-Type': 'application/json',
                };
    
                const requestBody = {
                    cnr: cnr_number,
                };
    
                try {
                    const response = await axios.post(apiUrl, requestBody, { headers });
                    apiResponse = response.data;
                } catch (error) {
                    console.error('Error fetching data:', error.response ? error.response.data : error.message);
                }

                
                // Log the API call
                await LogModel.createLog({
                    user_id: user_id,
                    event: 'API Call',
                    description: `API called to validate case with CNR ${cnr_number}`,
                });
            } catch (error) {
                console.error("Error during API call:", error);
                await LogModel.createLog({
                    user_id: user_id,
                    event: 'Error in API Call',
                    description: `Error occurred while calling API for CNR ${cnr_number}: ${error.message}`,
                });
                return res.status(500).json({ status: false, message: "Error calling external API" });
            }
    
            
            const { details, status, parties } = apiResponse;
            const apicaseNumber = details.registrationNumber.split("/")[0];

            console.log("JSON.stringify(parties.petitionerAdvocates || [])",
                parties.petitionerAdvocates )
    
            const caseData = {
                user_id: user_id,
                state: state,
                district: district,
                court_complex: court_complex,
                case_type: details.type,
                case_number: case_number,
                cnr_number: cnr_number,
                party_name: party_name || 'N/A',
                next_date: status.nextHearingDate,
                is_approved: false,
                court_establishment: court_establishment,
                petitioners: JSON.stringify(parties.petitionerAdvocates || []), // Store as JSON string
                respondents: JSON.stringify(parties.respondents || []), // Store as JSON string
                respondent_advocates: JSON.stringify(parties.respondentAdvocates || []), // Store as JSON string
                case_stage: status.caseStage,
                court_number_and_judge: status.courtNumberAndJudge,
                petitioner_advocates: JSON.stringify(parties.petitioners || []),

            };
    
            // Step 4: Validate the case against the API response
            if (apiResponse && apiResponse.cnr === cnr_number && apicaseNumber === case_number) {
                // Case is approved
                caseData.is_approved = true;
                await CaseModel.createCase(caseData);
    
                await LogModel.createLog({
                    user_id: user_id,
                    event: 'Case Approved and Saved',
                    description: `Case with CNR ${cnr_number} was approved and saved for user ${user_id}`,
                });
    
                res.status(200).json({ status: true, message: "Case saved successfully" });
            } else {
                const response = await CaseModel.createCase(caseData);
    
                await redisClient.set(response.insertId.toString(), JSON.stringify(apiResponse));
    
                await LogModel.createLog({
                    user_id: user_id,
                    event: 'Case Saved in Redis',
                    description: `Case with CNR ${cnr_number} was saved in Redis for user ${user_id}`,
                });
    
                res.status(200).json({ status: true, message: "Case saved in Redis (not approved)" });
            }
        } catch (error) {
            console.error("🔥 Error in saveAndValidateCase:", error);
            await LogModel.createLog({
                user_id: req.body.user_id,
                event: 'Internal Server Error',
                description: `Internal server error occurred in saveAndValidateCase: ${error.message}`,
            });
            res.status(200).json({ status: false, message: error.message });
        }
    },
    
  
    

    async getUserCases(req, res) {
        console.log("Fetching all cases with filters");
        try {
            const user_id = req.params.user_id;
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
            const offset = (page - 1) * limit;
    
            // Extract filter parameters
            const filters = {
                cnr_number: req.query.cnr_number || "",
                case_number: req.query.case_number || "",
                case_status: req.query.case_status || "", // Expected: "approved", "not_approved", or ""
                next_date: req.query.next_date || "",
            };
    
            const { cases, totalPages } = await CaseModel.getAllUserCases(user_id, limit, offset, filters);
            res.status(200).json({
                status: true,
                message: "Cases fetched successfully",
                data: cases,
                totalPages: totalPages,
            });
        } catch (error) {
            console.error("🔥 Error in getUserCases:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },

    //admin cases 
    async getAllCases(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 10; 
            const offset = (page - 1) * limit;
    
            const cases = await CaseModel.getAllAdminCases(limit, offset);
            res.status(200).json({ status: true, message: "Cases fetched successfully", data: cases });
        } catch (error) {
            console.error("🔥 Error in getAllCases:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    
    // delete cases
    async deleteCase(req, res) {
         
        try {
            const case_id = req.params.case_id;
            await CaseModel.deleteCase(case_id);
            res.status(200).json({ status: true, message: "Case deleted successfully" });
        } catch (error) {
            console.error("🔥 Error in deleteCase:", error) 
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    //case history 
    async gtCaseHistory(req, res){
        const {user_id} = req.params;

        try {
            const history = await CaseModel.getCaseHistory(user_id);
            res.status(200).json({status: true, message: "Case history fetched successfully", history})
        } catch (error) {
            console.error("🔥 Error in gtCaseHistory:", error);
        }

    },
    // update case of user when cnr_number and case_type matches
    async updateCase(req, res) {
        try {
          const { user_id, cnr_number, case_number, court_complex, case_id } = req.body;
      
          // Step 1: Fetch case details from Redis using case_id
          const cachedCase = await redisClient.get(case_id.toString());
      
          if (!cachedCase) {
            return res.status(404).json({
              status: false,
              message: "Case not found in Redis",
            });
          }
      
          const caseFromCache = JSON.parse(cachedCase);
          const { details } = caseFromCache;
      
          console.log("caseFromCache details:", details);
      
          // Step 2: Compare provided case_number with filingNumber[0] in Redis
          const redisCaseNumber = details?.filingNumber?.split("/")?.[0] || null;
      
          if (!redisCaseNumber || redisCaseNumber !== case_number) {
            return res.status(400).json({
              status: false,
              message: "Case number mismatch with Redis data",
            });
          }
      
         
      
          // Step 4: Fetch existing case from the database using CNR number
          const existingCase = await CaseModel.getCaseByCNRAndType(user_id, cnr_number);
      
          if (!existingCase) {
            return res.status(404).json({
              status: false,
              message: "No matching case found with the provided CNR number",
            });
          }
      
          // Step 5: Prepare updated data, ensuring all fields are updated
          const updatedData = {
            case_number: redisCaseNumber ,
            court_complex: court_complex || existingCase.court_complex,
            next_date: existingCase.next_date, // Keeping the same next_date
          };
      
          // Step 6: Update the case in the database
          await CaseModel.updateCase(user_id, cnr_number, existingCase.case_type, updatedData);



           // Step 3: Remove the case from Redis
           await redisClient.del(case_id.toString());
      
          // Step 7: Log the update
          await LogModel.createLog({
            user_id: user_id,
            event: "Case Updated",
            description: `Case with CNR ${cnr_number} was updated for user ${user_id}, removed from Redis`,
          });
      
          return res.status(200).json({
            status: true,
            message: "Case updated successfully and removed from Redis",
          });
        } catch (error) {
          console.error("🔥 Error in updateCase:", error);
      
          await LogModel.createLog({
            user_id: req.body.user_id,
            event: "Internal Server Error",
            description: `Error in updateCase: ${error.message}`,
          });
      
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
          });
        }
      }
      
      
    
};

module.exports = caseController;