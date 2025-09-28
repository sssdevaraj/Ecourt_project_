const connection = require("../sqlDb/sqlDb.js");

const caseModel = {
    // async createCase(data) {
    //     const sql = `
    //     INSERT INTO cases 
    //     (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, district, court_complex, case_type)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    //     const caseHistorySql = `
    //     INSERT INTO case_history 
    //     (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, district, court_complex, case_type)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
      
    //     const partyName = data.party_name || 'N/A';
    //     const nextDate = data.next_date || new Date().toISOString().split('T')[0];
    //     const isApproved = data.is_approved || 0;
    
    //     try {
            
    //         const [caseResult] = await connection.query(sql, [
    //             data.cnr_number,
    //             data.case_number,
    //             partyName,
    //             nextDate,
    //             isApproved,
    //             data.user_id,
    //             data.state,
    //             data.district,
    //             data.court_complex,
    //             data.case_type
    //         ]);
    
            
    //         await connection.query(caseHistorySql, [
    //             data.cnr_number,
    //             data.case_number,
    //             partyName,
    //             nextDate,
    //             isApproved,
    //             data.user_id,
    //             data.state,
    //             data.district,
    //             data.court_complex,
    //             data.case_type
    //         ]);
    
    //         return caseResult;
    //     } catch (error) {
    //         console.error("🔥 Error in createCase:", error.message);
    //         throw new Error(`Database error while saving case: ${error.message}`);
    //     }
    // },

    //get cases by user and cnr number 


    // async createCase(data) {
    //     console.log("data", data)
    //     // Determine which court field to use
    //     const courtField = data.court_complex ? 'court_complex' : 'court_establisment';
    //     const courtValue = data.court_complex || data.court_establishment || null;
    
    //     const sql = `
    //         INSERT INTO cases 
    //         (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, district, ${courtField}, case_type)
    //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    //     const caseHistorySql = `
    //         INSERT INTO case_history 
    //         (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, district,  case_type)
    //         VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?)`;
    
    //     const partyName = data.party_name || 'N/A';
    //     const nextDate = data.next_date || new Date().toISOString().split('T')[0];
    //     const isApproved = data.is_approved || 0;
    
    //     try {
    //         const [caseResult] = await connection.query(sql, [
    //             data.cnr_number,
    //             data.case_number,
    //             partyName,
    //             nextDate,
    //             isApproved,
    //             data.user_id,
    //             data.state,
    //             data.district,
    //             courtValue,
    //             data.case_type
    //         ]);
    
    //         await connection.query(caseHistorySql, [
    //             data.cnr_number,
    //             data.case_number,
    //             partyName,
    //             nextDate,
    //             isApproved,
    //             data.user_id,
    //             data.state,
    //             data.district,
    //             courtValue,
    //             data.case_type
    //         ]);
    
    //         return caseResult;
    //     } catch (error) {
    //         console.error("🔥 Error in createCase:", error.message);
    //         throw new Error(`Database error while saving case: ${error.message}`);
    //     }
    // },



    async  createCase(data) {
        console.log("data", data);
    
        const courtField = data.court_complex ? 'court_complex' : 'court_establisment';
        const courtValue = data.court_complex || data.court_establishment || null;
    
        const sql = `
            INSERT INTO cases 
            (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, 
             district, ${courtField}, case_type, petitioners, respondents, respondent_advocates, 
             case_stage, court_and_judge, petitioner_advocates)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?)`;
    
        const caseHistorySql = `
            INSERT INTO case_history 
            (cnr_number, case_number, party_name, next_date, is_approved, user_id, state, 
             district, case_type, petitioners, respondents, respondent_advocates)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const partyName = data.party_name || 'N/A';
        const nextDate = data.next_date || new Date().toISOString().split('T')[0];
        const isApproved = data.is_approved || 0;
        const petitioners = data.petitioners || '[]'; 
        const respondents = data.respondents || '[]'; 
        const respondentAdvocates = data.respondent_advocates || '[]'; 
    
        try {
            const [caseResult] = await connection.query(sql, [
                data.cnr_number,
                data.case_number,
                partyName,
                nextDate,
                isApproved,
                data.user_id,
                data.state,
                data.district,
                courtValue,
                data.case_type,
                petitioners,
                respondents,
                respondentAdvocates,
                data.case_stage,
                data.court_number_and_judge,
                data.petitioner_advocates
            ]);
    
            await connection.query(caseHistorySql, [
                data.cnr_number,
                data.case_number,
                partyName,
                nextDate,
                isApproved,
                data.user_id,
                data.state,
                data.district,
                data.case_type,
                petitioners,
                respondents,
                respondentAdvocates,
            ]);
    
            return caseResult;
        } catch (error) {
            console.error("🔥 Error in createCase:", error.message);
            throw new Error(`Database error while saving case: ${error.message}`);
        }
    },
    async getCaseByUserAndCNR(user_id, cnr_number) {
        const sql = "SELECT * FROM cases WHERE user_id = ? AND cnr_number = ?";
        try {
            const [result] = await connection.query(sql, [user_id, cnr_number]);
            return result[0];
        } catch (error) {
            console.error("🔥 Error in getCaseByUserAndCNR:", error.message);
            throw new Error("Database error while getting case by user and CNR number");
        }
    },


    // async getAllUserCases(user_id, limit, offset) {
    //     const countSql = "SELECT COUNT(*) AS total FROM cases WHERE user_id = ?";
    //     const dataSql = "SELECT * FROM cases WHERE user_id = ? LIMIT ? OFFSET ?";
        
    //     try {
    //         // Get total count of cases for pagination
    //         const [[countResult]] = await connection.query(countSql, [user_id]);
    //         const totalCases = countResult.total;
    //         const totalPages = Math.ceil(totalCases / limit); 
    
    //         // Get paginated cases
    //         const [result] = await connection.query(dataSql, [user_id, limit, offset]);
    
    //         return {
    //             cases: result,
    //             totalPages
    //         };
    //     } catch (error) {
    //         console.error("🔥 Error in getAllUserCases:", error.message);
    //         throw new Error("Database error while getting user cases");
    //     }
    // },

    async getAllUserCases(user_id, limit, offset, filters = {}) {
        try {
            // Initialize base SQL queries
            let countSql = "SELECT COUNT(*) AS total FROM cases WHERE user_id = ?";
            let dataSql = "SELECT * FROM cases WHERE user_id = ?";
            const queryParams = [user_id];
    
            // Build filter conditions
            const filterConditions = [];
            if (filters.cnr_number) {
                filterConditions.push("cnr_number LIKE ?");
                queryParams.push(`%${filters.cnr_number}%`);
            }
            if (filters.case_number) {
                filterConditions.push("case_number LIKE ?");
                queryParams.push(`%${filters.case_number}%`);
            }
            if (filters.case_status) {
                // Map case_status to is_approved (approved -> true, not_approved -> false)
                filterConditions.push("is_approved = ?");
                queryParams.push(filters.case_status === "approved" ? 1 : 0);
            }
            if (filters.next_date) {
                filterConditions.push("DATE(next_date) = ?");
                queryParams.push(filters.next_date);
            }
    
            // Append filter conditions to SQL queries
            if (filterConditions.length > 0) {
                const conditionString = filterConditions.join(" AND ");
                countSql += ` AND ${conditionString}`;
                dataSql += ` AND ${conditionString}`;
            }
    
            // Add pagination to data query
            dataSql += " LIMIT ? OFFSET ?";
            queryParams.push(limit, offset);
    
            // Execute queries
            const [[countResult]] = await connection.query(countSql, queryParams);
            const totalCases = countResult.total;
            const totalPages = Math.ceil(totalCases / limit);
    
            const [result] = await connection.query(dataSql, queryParams);
    
            return {
                cases: result,
                totalPages,
            };
        } catch (error) {
            console.error("🔥 Error in getAllUserCases:", error.message);
            throw new Error("Database error while getting user cases");
        }
    },
    
    // get all cases 
    async getAllAdminCases(limit, offset) {
        const sql = "SELECT * FROM cases LIMIT ? OFFSET ?";
        try {
            const [result] = await connection.query(sql, [limit, offset]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getAllCases:", error.message);
            throw new Error("Database error while getting all cases");
        }
    },

    async deleteCase(case_id) {
        const sql = "DELETE FROM cases WHERE id = ?";
        try {
            const [result] = await connection.query(sql, [case_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in deleteCase:", error.message);
            throw new Error("Database error while deleting case");
        }
    },

    async getCaseHistory(user_id) {
        const sql = "SELECT * FROM case_history WHERE user_id = ?";
        try {
            const [result] = await connection.query(sql, [user_id]);
            return result;
        } catch (error) {
            console.error("🔥 Error in getCaseHistory:", error.message);
            throw new Error("Database error while getting case history");
        }
    },


    async updateCase(user_id, cnr_number, case_type, updatedData) {
        const sql = `
            UPDATE cases 
            SET 
                next_date = ?, 
                court_complex = ?, 
                case_number = ?, 
                is_approved = 1
            WHERE user_id = ? AND cnr_number = ? AND case_type = ?;
        `;
    
        try {
            const [result] = await connection.query(sql, [
                updatedData.next_date,    
                updatedData.court_complex,
                updatedData.case_number, 
                user_id,                  
                cnr_number,              
                case_type                 
            ]);
    
            return result;
        } catch (error) {
            console.error("🔥 Error in updateCase:", error.message);
            throw new Error(`Database error while updating case: ${error.message}`);
        }
    },
    
    
      async getCaseByCNRAndType(user_id, cnr_number, case_type) {
        const sql = `
                SELECT * FROM cases 
                WHERE user_id = ? AND cnr_number = ?;
            `;
    
        try {
          const [rows] = await connection.query(sql, [
            user_id,
            cnr_number
          ]);
          return rows.length > 0 ? rows[0] : null;
        } catch (error) {
          console.error("🔥 Error in getCaseByCNRAndType:", error.message);
          throw new Error(`Database error while fetching case: ${error.message}`);
        }
      },


   
};

module.exports = caseModel;