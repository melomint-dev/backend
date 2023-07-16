import {
  clearRedisDatabase,
  getAllTrackPlayTimes,
  getAllTrackViews,
  incrementTrackPlayTime,
  incrementTrackViews,
} from "../utils/redis/viewsOperations.js";

export const ping = async (req, res) => {
  try {
    const { trackId } = req.body;
    console.log("ping", trackId); // development only
    await incrementTrackPlayTime(trackId, 10).then((replied) => {
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
    await incrementTrackViews(trackId).then(() => {
      res.status(200).json({ message: `Views for track ${trackId}` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// a controller to update the views and play time of all tracks to flowchain
export const updateViewsAndPlayTime = async (req, res) => {
  try {
    const allTrackViews = await getAllTrackViews();
    const allTrackPlayTime = await getAllTrackPlayTimes();
    await clearRedisDatabase();
    console.log("allTrackViews", allTrackViews); // development only
    console.log("allTrackPlayTime", allTrackPlayTime); // development only

    // update the views and play time of all tracks to flowchain

    res.status(200).json({
      message: "All track views and play time updated to flowchain",
      flowRes: '<flowchain response>',
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

