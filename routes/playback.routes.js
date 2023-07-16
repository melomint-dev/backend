import { Router } from "express";
import { clickedTrack, ping, updatePlaysAndPlayTime } from "../controllers/redisController.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js"

const router = Router();

router.post("/ping", ping);
router.post("/clickedTrack", clickedTrack);
router.post("/updateCadance", adminAuth, updatePlaysAndPlayTime);

export default router;