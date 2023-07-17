import { Router } from "express";
import {
  abstractionsController,
  sendTx,
} from "../controllers/flowController.js";

const router = Router();

router
  .get("/sendTx", sendTx)
  .get("/abstractions/songs/all", abstractionsController.getAllSongs)
  .get("/abstractions/songs/trending", abstractionsController.getTrendingSongs)
  .get("/abstractions/songs/latest", abstractionsController.getLatestSongs)
  .get("/abstractions/artists/rising", abstractionsController.getArtistsOnRise);

export default router;
