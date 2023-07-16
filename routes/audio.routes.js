import express from "express";
import { uploadFile, getFile } from "../controllers/audioController.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

router.post("/upload", upload, uploadFile);
router.get("/get-file/:ipfsHash", getFile);

export default router;
