// utils/redis/cacheOperations.js
import { redisClient } from "./redisConnection.js";

const trackViewsKey = "track:views";
const trackPlayTimeKey = "track:playtime";

export const incrementTrackViews = async (songId) => {
  await redisClient.hIncrBy(trackViewsKey, songId, 1).then((replied) => {
    console.log(`Views for track ${songId} incremented to ${replied}`); // development only
  });
};

export const getAllTrackViews = async () => {
  var trackViews = await redisClient.hGetAll(trackViewsKey);
  // .then((trackViews) => {
  //   trackViews = JSON.parse(JSON.stringify(trackViews));
  //   console.log("Total views of all tracks are ", trackViews);
  //   return trackViews;
  // });
  trackViews = JSON.parse(JSON.stringify(trackViews));
  console.log("Total views of all tracks are ", trackViews);
  return trackViews;
};

export const incrementTrackPlayTime = async (songId, playTimeInSeconds) => {
  await redisClient
    .hIncrBy(trackPlayTimeKey, songId, playTimeInSeconds)
    .then((replied) => {
      console.log(`Play time for track ${songId} incremented to ${replied}`); // development only
      return replied;
    });
};

export const getAllTrackPlayTimes = async () => {
  var trackPlayTime = await redisClient.hGetAll(trackPlayTimeKey);
  // .then((trackPlayTime) => {
  //   trackPlayTime = JSON.parse(JSON.stringify(trackPlayTime));
  //   console.log("All tracks total play time: ", trackPlayTime);
  //   return trackPlayTime;
  // });
  trackPlayTime = JSON.parse(JSON.stringify(trackPlayTime));
  console.log("All tracks total play time: ", trackPlayTime);
  return trackPlayTime;
};

export const clearRedisDatabase = async () => {
  const multi = redisClient.multi();
  multi.flushDb();
  await multi.exec().then((replies) => {
    console.log("Redis database cleared");
    console.log(replies);
  });
};
