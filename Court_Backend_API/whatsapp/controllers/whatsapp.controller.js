const whatsappModel = require('../models/whatsapp.model.js');
const whatsappQueue = require('../../queue/whats-app-queue.js')


const whatsappController = {
    async handleManualMessage(req, res) {
        const { user_id, case_id } = req.body;
        let status;
        try {
            if (!user_id || !case_id || case_id.length === 0) {
                return res.status(400).json({ status: false, message: "User ID and at least one Case ID are required" });
            }


            const phoneNumbers = await whatsappModel.getPhoneNumbers(user_id);
            if (!phoneNumbers || phoneNumbers.length === 0) {
                return res.status(200).json({ status: false, message: "No subscription found for user" });
            }


            const cases = await whatsappModel.getCaseDetails(case_id, user_id);

            if (!cases || cases.length === 0) {
                return res.status(200).json({ status: false, message: "No cases found" });
            }

            for (const { number } of phoneNumbers) {
                for (const caseItem of cases) {
                    const petitioners = JSON.parse(caseItem.petitioners || '[]').join(', ') || "Unknown";
                    const petitionerAdvs = JSON.parse(caseItem.petitioner_advocates || '[]').join(', ') || "Unknown";
                    const respondents = JSON.parse(caseItem.respondents || '[]').join(', ') || "Unknown";
                    const respondentAdvs = JSON.parse(caseItem.respondent_advocates || '[]').join(', ') || "Unknown";
            
                    const formattedDate = caseItem.next_date
                        ? new Date(caseItem.next_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "Unknown"; // → format: 20-Jun-2025
            
                    const templateParams = [
                        `${petitioners} (${petitionerAdvs})`,                          // 1
                        caseItem.cnr_number || "Unknown",                              // 2
                        caseItem.case_number || "Unknown",                             // 3
                        caseItem.case_type || "Unknown",                               // 4
                        caseItem.court_and_judge || "Unknown",                         // 5
                        "Issue of Service",                                            // 6 - Cause (you can replace this dynamically)
                        caseItem.case_stage || "Unknown",                              // 7
                        `${respondents} (${respondentAdvs})`,                          // 8
                        "Seetha",                                                      // 9 - fixed for now
                        "Judge on E.L. Re posted to",                                  // 10 - last hearing note (you can replace this)
                        formattedDate,                                                 // 11
                        "Issue of Service"                                             // 12 - Next purpose (customize if needed)
                    ];
            
                    const jobData = {
                        user_id,
                        number,
                        templateParams,
                    };
            
                    await whatsappQueue.add('send-whatsapp-message', jobData, {
                        removeOnComplete: { age: 30, count: 1000 },
                    });
                }
            }
            


            await whatsappQueue.clean(0, 1000, 'completed');
            await whatsappQueue.clean(0, 1000, 'failed');

            res.status(200).json({
                status: true,
                message: "whatsapp message sent successfully",

            });

        } catch (error) {
            console.error("❌ Error in handleManualMessage:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    }

   



};

module.exports = whatsappController;
