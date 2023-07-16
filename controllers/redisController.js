import {
  clearRedisDatabase,
  getAllTrackPlayTimes,
  getAllTrackPlays,
  incrementTrackPlayTime,
  incrementTrackPlays,
} from "../utils/redis/viewsOperations.js";

export const ping = async (req, res) => {
  try {
    const { trackId } = req.body;
    trackId.toString();
    console.log("ping", trackId); // development only
    await incrementTrackPlayTime(trackId, 10).then(() => {
      res.status(200).json({ message: `Play time for track ${trackId}` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clickedTrack = async (req, res) => {
  try {
    const { trackId } = req.body;
    trackId.toString();
    await incrementTrackPlays(trackId).then(() => {
      res.status(200).json({ message: `Plays for track ${trackId}` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// a controller to update the Plays and play time of all tracks to flowchain
export const updatePlaysAndPlayTime = async (req, res) => {
  try {
    const allTrackPlays = await getAllTrackPlays();
    const allTrackPlayTime = await getAllTrackPlayTimes();
    await clearRedisDatabase();
    console.log("allTrackPlays", allTrackPlays); // development only
    console.log("allTrackPlayTime", allTrackPlayTime); // development only

    // update the Plays and play time of all tracks to flowchain

    res.status(200).json({
      message: "All track Plays and play time updated to flowchain",
      flowRes: '<flowchain response>',
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

