// utils/redis/redisConnection.js
import { createClient } from 'redis';
import config from '../../config/serverConfig.js';

export const redisClient = createClient({
  password: config.redis.password,
  socket: {
      host: 'redis-13926.c264.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 13926
  }
});

redisClient.connect();

// Handle errors if any
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});



