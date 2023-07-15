import { Router } from "express";
import { sendTx } from "../controllers/flowController.js";

const router = Router();

router.get("/sendTx", sendTx);

export default router;
