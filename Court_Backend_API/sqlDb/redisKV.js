require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT), // Ensure port is a number
    },
    username: process.env.REDIS_USERNAME || undefined, 
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log(`✅ Connected to Redis Cloud at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("❌ Redis Connection Failed:", error);
    }
})();

module.exports = redisClient;
