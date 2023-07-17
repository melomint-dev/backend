import { Router } from "express";
import {
  abstractionsController,
  sendTx,
} from "../controllers/flowController.js";

const router = Router();

router.get("/sendTx", sendTx).get("/songs", abstractionsController.getAllSongs);

export default router;
