const sqlDb = require('../../sqlDb/sqlDb.js');
const whatsappModel = require('../models/whatsapp.model.js');
const whatsappQueue = require('../../queue/whats-app-queue.js');
const cron = require('node-cron');

// Function to get user IDs with their phone numbers
async function getUserIdsWithCases() {
    const sql = `
        SELECT DISTINCT u.id AS user_id, p.number
        FROM users u
        JOIN cases c ON u.id = c.user_id
        JOIN user_subscriptions s ON s.user_id = u.id
        JOIN phone_numbers p ON s.id = p.subscription_id
        WHERE s.id = (
            SELECT id 
            FROM user_subscriptions 
            WHERE user_id = u.id 
            ORDER BY created_at DESC 
            LIMIT 1
        )
    `;
    const [rows] = await sqlDb.query(sql);

    // Group phone numbers by user_id
    const grouped = {};
    for (const row of rows) {
        if (!grouped[row.user_id]) grouped[row.user_id] = [];
        grouped[row.user_id].push(row.number);
    }

    return Object.entries(grouped).map(([user_id, numbers]) => ({
        user_id: Number(user_id),
        numbers
    }));
}

// Main function to process users and queue WhatsApp messages
async function processUsersAndSendWhatsApp() {
    console.log("🟡 Starting WhatsApp job...");

    try {
        const usersWithNumbers = await getUserIdsWithCases();

        if (!usersWithNumbers.length) {
            console.log("ℹ️ No users with cases found.");
            return;
        }

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1); // 2 days ahead
        const formattedTargetDate = targetDate.toISOString().split('T')[0];

        for (const { user_id, numbers } of usersWithNumbers) {
            // Fetch enriched case details matching template requirements
            const [cases] = await sqlDb.query(`
                SELECT id, user_id, case_number, cnr_number, next_date,
                       case_type, court_and_judge,  case_stage,
                       petitioners, petitioner_advocates, 
                       respondents, respondent_advocates
                FROM cases
                WHERE user_id = ?
                  AND next_date = ?
            `, [user_id, formattedTargetDate]);

            if (!cases.length) {
                console.log(`ℹ️ No cases for user ${user_id} on ${formattedTargetDate}`);
                continue;
            }

            for (const caseItem of cases) {
                const petitioners = JSON.parse(caseItem.petitioners || '[]').join(', ') || "Unknown";
                const petitionerAdvs = JSON.parse(caseItem.petitioner_advocates || '[]').join(', ') || "Unknown";
                const respondents = JSON.parse(caseItem.respondents || '[]').join(', ') || "Unknown";
                const respondentAdvs = JSON.parse(caseItem.respondent_advocates || '[]').join(', ') || "Unknown";

                const formattedDate = caseItem.next_date
                        ? new Date(new Date(caseItem.next_date).setDate(new Date(caseItem.next_date).getDate() + 1))
                            .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "Unknown";

                const templateParams = [
                    `${petitioners} (${petitionerAdvs})`,            // 1
                    caseItem.cnr_number || "Unknown",                // 2
                    caseItem.case_number || "Unknown",               // 3
                    caseItem.case_type || "Unknown",                 // 4
                    caseItem.court_and_judge || "Unknown",           // 5
                    caseItem.cause || "Issue of Service",            // 6
                    caseItem.case_stage || "Unknown",                // 7
                    `${respondents} (${respondentAdvs})`,            // 8
                    "Seetha",                                        // 9 (Hardcoded judge/registrar name)
                    "Judge on E.L. Re posted to",                    // 10 (Last hearing note)
                    formattedDate,                                   // 11 (Next hearing date)
                    caseItem.cause || "Issue of Service"             // 12 (Next step / purpose)
                ];

                for (const number of numbers) {
                    const jobData = {
                        user_id,
                        number,
                        templateParams
                    };

                    await whatsappQueue.add('send-whatsapp-message', jobData, {
                        removeOnComplete: { age: 3600, count: 1000 },
                        removeOnFail: { age: 86400, count: 1000 }
                    });
                }
            }

            console.log(`✅ Queued ${cases.length} case(s) for user ${user_id}`);
        }

        // Clean up old jobs
        await whatsappQueue.clean(3600 * 1000, 1000, 'completed');
        await whatsappQueue.clean(86400 * 1000, 1000, 'failed');

        console.log("🟢 WhatsApp job completed.");
    } catch (error) {
        console.error("❌ Error in WhatsApp job:", error.message);
    }
}



// // Uncomment to schedule daily runs (adjust time as needed)
// cron.schedule('0 9 * * *', processUsersAndSendWhatsApp);
cron.schedule('0 13 * * *', processUsersAndSendWhatsApp);
// cron.schedule('*/30 * * * * *', processUsersAndSendWhatsApp);

// or 9:00 AM once per day


// console.log("🚀 WhatsApp job scheduler started.");

// const sqlDb = require('../../sqlDb/sqlDb.js');
// const whatsappModel = require('../models/whatsapp.model.js');
// const whatsappQueue = require('../../queue/whats-app-queue.js');
// const cron = require('node-cron');

// // Function to get user IDs with their phone numbers
// async function getUserIdsWithCases() {
//     const sql = `
//         SELECT DISTINCT u.id AS user_id, p.number
//         FROM users u
//         JOIN cases c ON u.id = c.user_id
//         JOIN user_subscriptions s ON s.user_id = u.id
//         JOIN phone_numbers p ON s.id = p.subscription_id
//         WHERE s.id = (
//             SELECT id 
//             FROM user_subscriptions 
//             WHERE user_id = u.id 
//             ORDER BY created_at DESC 
//             LIMIT 1
//         )
//     `;
//     const [rows] = await sqlDb.query(sql);

//     // Group phone numbers by user_id
//     const grouped = {};
//     for (const row of rows) {
//         if (!grouped[row.user_id]) grouped[row.user_id] = [];
//         grouped[row.user_id].push(row.number);
//     }

//     return Object.entries(grouped).map(([user_id, numbers]) => ({
//         user_id: Number(user_id),
//         numbers
//     }));
// }

// // Main function to process users and queue WhatsApp messages
// async function processUsersAndSendWhatsApp() {
//     console.log("🟡 Starting WhatsApp job...");

//     try {
//         const usersWithNumbers = await getUserIdsWithCases();

//         if (!usersWithNumbers.length) {
//             console.log("ℹ️ No users with cases found.");
//             return;
//         }

//         // Calculate today and target date (2 days from now) in YYYY-MM-DD format
//         const today = new Date();
//         const targetDate = new Date();
//         targetDate.setDate(today.getDate() + 2);

//         const formattedTargetDate = targetDate.toISOString().split('T')[0];
//         const formattedToday = today.toISOString().split('T')[0];

//         for (const { user_id, numbers } of usersWithNumbers) {
//             // Get cases where next_date equals target date
//             const [cases] = await sqlDb.query(
//                 `SELECT id, case_number, cnr_number, next_date 
//                  FROM cases 
//                  WHERE user_id = ? 
//                    AND next_date = ?`,
//                 [user_id, formattedTargetDate]
//             );

//             // Filter the result manually for dates between (today < next_date <= targetDate)
//             const filteredCases = cases.filter(caseItem => {
//                 const nextDate = new Date(caseItem.next_date);
//                 return nextDate > today && nextDate <= targetDate;
//             });

//             if (!filteredCases.length) {
//                 console.log(`ℹ️ No upcoming cases found for user ${user_id} (hearing within next 2 days)`);
//                 continue;
//             }

//             for (const number of numbers) {
//                 for (const caseItem of filteredCases) {
//                     const jobData = {
//                         user_id,
//                         number,
//                         message: `🔔 Reminder: Your case ${caseItem.case_number} (CNR: ${caseItem.cnr_number}) has a hearing scheduled in 2 days on ${caseItem.next_date}.`
//                     };

//                     await whatsappQueue.add('send-whatsapp-message', jobData, {
//                         removeOnComplete: { age: 3600, count: 1000 },
//                         removeOnFail: { age: 86400, count: 1000 }
//                     });
//                 }
//             }

//             console.log(`✅ Queued ${filteredCases.length} reminder(s) for user ${user_id}`);
//         }

//         // Clean old jobs
//         await whatsappQueue.clean(3600 * 1000, 1000, 'completed');
//         await whatsappQueue.clean(86400 * 1000, 1000, 'failed');

//         console.log("🟢 WhatsApp job completed.");
//     } catch (error) {
//         console.error("❌ Error in WhatsApp job:", error.message);
//         // Add error monitoring/alerting here if needed
//     }
// }

// // Uncomment to schedule daily runs (adjust time as needed)
// cron.schedule('2 10 * * *', processUsersAndSendWhatsApp); // Run daily at 10:02 AM


// console.log("🚀 WhatsApp job scheduler started.");
