// utils/redis/redisConnection.js
import { createClient } from 'redis';
import config from '../../config/serverConfig';

const redisClient = createClient({
  password: config.redis.password,
  socket: {
      host: 'redis-13926.c264.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 13926
  }
});

// Handle errors if any
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;

