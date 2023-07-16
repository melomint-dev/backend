import { Router } from "express";
import { clickedTrack, ping, updateViewsAndPlayTime } from "../controllers/redisController.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js"

const router = Router();

router.post("/ping", ping);
router.post("/clickedTrack", clickedTrack);
router.post("/updateCadance", adminAuth, updateViewsAndPlayTime);

export default router;