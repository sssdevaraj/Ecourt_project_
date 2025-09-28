// const axios = require("axios");
// require("dotenv").config();
// const LogModel = require("../logModel.js");

// const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
// const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
// const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_TOKEN;

// const sendMessages = async (to, body, user_id) => {

//     console.log("test", body);

   
//     try {
//         // Extract parameters dynamically from the body using RegEx
//         const cnr = body.match(/cnr number ([A-Z0-9]+)/i)?.[1]?.trim();
//         const caseNumber = body.match(/case number ([0-9]+)/i)?.[1]?.trim();
//         const hearingDateRaw = body.match(/next hearing date ([^\-]+)/i)?.[1]?.trim();
//         const hearingDate = hearingDateRaw ? new Date(hearingDateRaw).toDateString() : null;

//         // Example: Extract party names and judge info (you must adapt these to your actual message format)
//         const petitioner = body.match(/petitioner: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";
//         const respondent = body.match(/respondent: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";
//         const stage = body.match(/stage: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";
//         const courtName = body.match(/court: ([^-\n]+)/i)?.[1]?.trim()  || "Unknown";
//         const caseType = body.match(/case type: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";
//         const cause = body.match(/cause: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";
//         const lastHearingNote = body.match(/note: ([^-\n]+)/i)?.[1]?.trim()     || "Unknown";
//         const nextStep = body.match(/next step: ([^-\n]+)/i)?.[1]?.trim() || "Unknown";

//         // Check for nulls
//         const required = [cnr, caseNumber, hearingDate, caseType, courtName, cause, stage, petitioner, respondent, lastHearingNote, nextStep];
//         if (required.some(v => v == null)) {
//             throw new Error("Missing required fields in body.");
//         }

        
//         const parameters = [
//             petitioner,     // 1
//             cnr,            // 2
//             caseNumber,     // 3
//             caseType,       // 4
//             courtName,      // 5
//             cause,          // 6
//             stage,          // 7
//             respondent,     // 8
//             "Seetha",       // 9 (assume fixed for now, or extract)
//             lastHearingNote,// 10
//             hearingDate,    // 11
//             nextStep        // 12
//         ];

//         // Send to WhatsApp API
//         const payload = {
//             messaging_product: "whatsapp",
//             to: `91${to}`,
//             type: "template",
//             template: {
//                 name: "auto_case_status_details",
//                 language: {
//                     code: "en_US",
//                     policy: "deterministic"
//                 },
//                 components: [
//                     {
//                         type: "body",
//                         parameters: parameters.map(text => ({
//                             type: "text",
//                             text
//                         }))
//                     }
//                 ]
//             }
//         };

//         const response = await axios.post(
//             `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
//             payload,
//             {
//                 headers: {
//                     Authorization: `Bearer ${ACCESS_TOKEN}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         await LogModel.createLog({
//             user_id,
//             event: 'WhatsApp Message Sent',
//             description: `Sent template message to ${to}`
//         });

//         return { success: true, messageId: response.data.messages[0].id };

//     } catch (error) {
//         console.error(`❌ WhatsApp API Error: ${error.response?.data?.error?.message || error.message}`);

//         await LogModel.createLog({
//             user_id,
//             event: 'WhatsApp Message Failed',
//             description: `Failed to send message to ${to}: ${error.response?.data?.error?.message || error.message}`,
//         });
        

//         return { success: false, error: error.response?.data?.error?.message || error.message };
//     }
// };

// module.exports = sendMessages;


const axios = require("axios");
require("dotenv").config();
const LogModel = require("../logModel.js");

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_PERMANENT_TOKEN;

const sendMessages = async (to, templateParams, user_id) => {
    try {
        // console.log(`📤 Sending WhatsApp message to ${to}:`, templateParams);

        if (!Array.isArray(templateParams) || templateParams.length !== 12) {
            throw new Error("Invalid templateParams: 12 values expected");
        }

        const payload = {
            messaging_product: "whatsapp",
            to: `91${to}`,
            type: "template",
            template: {
                name: "auto_case_status_details",
                language: {
                    code: "en_US",
                    policy: "deterministic"
                },
                components: [
                    {
                        type: "body",
                        parameters: templateParams.map(text => ({
                            type: "text",
                            text
                        }))
                    }
                ]
            }
        };

        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        await LogModel.createLog({
            user_id,
            event: 'WhatsApp Message Sent',
            description: `Template message sent to ${to}`
        });

        return { success: true, messageId: response.data.messages[0].id };

    } catch (error) {
        const errMsg = error.response?.data?.error?.message || error.message;
        console.error(`❌ WhatsApp API Error: ${errMsg}`);

        await LogModel.createLog({
            user_id,
            event: 'WhatsApp Message Failed',
            description: `Failed to send message to ${to}: ${errMsg}`,
        });

        return { success: false, error: errMsg };
    }
};

module.exports = sendMessages;
