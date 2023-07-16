import { Router } from "express";
import { transactions } from "../controllers/flowController.js";

const router = Router();

router.get("/sampleTx", transactions.sampleTransaction);

export default router;
