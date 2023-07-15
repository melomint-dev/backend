// utils/redis/cacheOperations.js
import { redisClinet } from './redisConnection.js';

const trackViewsKey = 'track:views';
const trackPlayTimeKey = 'track:playtime';

export const incrementTrackViews = (songId) => {
  redisClinet.hincrby(trackViewsKey, songId, 1, (error, updatedViews) => {
    if (error) {
      console.error('Error incrementing track views:', error);
    } else {
      console.log(`Views for track ${songId} incremented to ${updatedViews}`);
    }
  });
}

export const getAllTrackViews = (callback) => {
  redisClinet.hgetall(trackViewsKey, (error, trackViews) => {
    if (error) {
      console.error('Error getting all track views:', error);
      callback(null); // Call the callback with null to indicate an error occurred
    } else {
      callback(trackViews);
    }
  });
}

export const incrementTrackPlayTime = (songId, playTimeInSeconds) => {
  redisClinet.hincrby(trackPlayTimeKey, songId, playTimeInSeconds, (error, updatedPlayTime) => {
    if (error) {
      console.error('Error incrementing track play time:', error);
    } else {
      console.log(`Play time for track ${songId} incremented to ${updatedPlayTime} seconds`);
    }
  });
}

export const getAllTrackPlayTimes = (callback) => {
  redisClinet.hgetall(trackPlayTimeKey, (error, trackPlayTimes) => {
    if (error) {
      console.error('Error getting all track play times:', error);
      callback(null); // Call the callback with null to indicate an error occurred
    } else {
      callback(trackPlayTimes);
    }
  });
}



