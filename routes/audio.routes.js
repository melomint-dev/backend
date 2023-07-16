import express from "express";
import {
  uploadFile,
  getFile,
  imgToIPFS,
} from "../controllers/audioController.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

const ImgUpload = multer({ storage: storage }).single("image");

router.post("/upload", upload, uploadFile);
router.get("/get-file/:ipfsHash", getFile);
router.post("/uploadImage", ImgUpload, imgToIPFS);

export default router;
