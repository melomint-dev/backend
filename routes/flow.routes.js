import { Router } from "express";
import {
  abstractionsController,
  scripts,
  transactions,
} from "../controllers/flowController.js";

const router = Router();

router
  .get("/abstractions/songs/all", abstractionsController.getAllSongs)
  .get("/abstractions/songs/trending", abstractionsController.getTrendingSongs)
  .get("/abstractions/songs/latest", abstractionsController.getLatestSongs)
  .get("/abstractions/artists/rising", abstractionsController.getArtistsOnRise)
  .get("/sampleTx", transactions.sampleTransaction)
  .post("/createSongHash", transactions.createSongHash)
  .post("/addSubscribers", transactions.addSubscribers)
  .get("/getGoldSongAsset", scripts.getGoldSongAsset)
  .get("/getNFTSongAsset", scripts.getNFTSongAsset);

export default router;
