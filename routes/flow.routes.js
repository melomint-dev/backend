import { Router } from "express";
import { scripts, transactions } from "../controllers/flowController.js";

const router = Router();

router.get("/sampleTx", transactions.sampleTransaction);
router.post("/createSongHash", transactions.createSongHash);
router.post("/addSubscribers", transactions.addSubscribers);
router.post("/addSubscribers", transactions.addSubscribers);

router.get("/getGoldSongAsset", scripts.getGoldSongAsset);
router.get("/getNFTSongAsset", scripts.getNFTSongAsset);

export default router;
