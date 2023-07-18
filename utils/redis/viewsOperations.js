// utils/redis/cacheOperations.js
import { redisClient } from "./redisConnection.js";

const trackPlaysKey = "track:play";
const trackPlayTimeKey = "track:playtime";

export const incrementTrackPlays = async (songId) => {
  await redisClient.hIncrBy(trackPlaysKey, songId, 1).then((replied) => {
    console.log(`Plays for track ${songId} incremented to ${replied}`); // development only
  });
};

export const getAllTrackPlays = async () => {
  var trackPlays = await redisClient.hGetAll(trackPlaysKey);
  trackPlays = JSON.parse(JSON.stringify(trackPlays));
  console.log("Total plays of all tracks are ", trackPlays);
  return trackPlays;
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


// get an array of n tracks with highest plays
const getTopNTracks = async (n) => {
  const trackPlays = await getAllTrackPlays();
  const topNTracks = Object.keys(trackPlays).sort((a, b) => trackPlays[b] - trackPlays[a]).slice(0, n);
  return topNTracks;
}

// set and get the top n tracks from redis
export const setTopNTracks = async (n) => {
  const topNTracks = await getTopNTracks(n);
  await redisClient.set("topNTracks", JSON.stringify(topNTracks));
  console.log("Top n tracks set in redis", topNTracks);
  return topNTracks;
}

export const getTopNTracksFromRedis = async () => {
  const topNTracks = await redisClient.get("topNTracks");
  console.log("Top n tracks from redis", topNTracks);
  return JSON.parse(topNTracks);
}
