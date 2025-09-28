const { Worker } = require('bullmq');
const LogModel = require("../logModel.js");
const workerModel = require("./workerModel.js");
const sendMessages = require('./twilio.js');

const whatsappWorker = new Worker('whatsapp-queue', async (job) => {
    try {
        const { user_id,  number,templateParams } = job.data;

       
       
        console.log(`🔄 Processing message for User ID: ${user_id}`);

        const userLimit = await workerModel.getLimitForUser(user_id);

        if (!userLimit) {
            console.log(`❌ User ${user_id} not found in subscriptions.`);
            return;
        }

        const { subscription_id, first_name, package } = userLimit;
        const { message_limit, is_active, messages_sent } = package;

        console.log(`📊 User: ${first_name} (ID: ${user_id}), Limit: ${messages_sent}/${message_limit}, Active: ${is_active}`);

        if (!is_active || messages_sent >= message_limit) {
            console.log(`❌ Limit reached for User ${user_id} (${first_name}). Message not sent.`);

            await LogModel.createLog({
                user_id,
                event: 'Message Limit Reached',
                description: `User ${first_name} (${user_id}) has reached their message limit.`,
            });
            return { success: false, message: 'Message limit reached' };
        }

        // Send WhatsApp message and handle Twilio failures
        // console.log(`📤 Sending WhatsApp message to ${number}:`, templateParams);
        const result = await sendMessages(number, templateParams, user_id);


        if (!result.success) {
            console.log(`❌ Failed to send message for User ID: ${user_id}`);
            return;
        }

        await workerModel.decrementMessageLimit(subscription_id);
        console.log(`✅ Message sent to ${number}: "${templateParams}"`);


        await LogModel.createLog({
            user_id,
            event: 'WhatsApp Message Sent',
            description: `Message sent to ${number}: "${templateParams}"`,
        });

    } catch (error) {
        console.error(`❌ Error processing job: ${error.message}`);

        await LogModel.createLog({
            user_id: job.data.user_id,
            event: 'Worker Error',
            description: `An error occurred while processing the job: ${error.message}`,
        });

        throw error;
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
    },
});

module.exports = whatsappWorker;
