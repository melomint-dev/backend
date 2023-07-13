import express from 'express';
import { uploadFile, getFile } from '../controllers/audioController.js';
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post('/upload', upload.single('file'), uploadFile);
router.get('/get-file/:ipfsHash', getFile);

export default router;