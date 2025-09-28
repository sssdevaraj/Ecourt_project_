const { Queue } = require('bullmq');


const whatsappQueue = new Queue('whatsapp-queue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
    }
    //we can able to add retry count here 

});

module.exports = whatsappQueue;
