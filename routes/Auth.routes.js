import express from 'express';
import { login, signup, checkToken } from '../controllers/AuthController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/checkToken', verifyToken, checkToken);

export default router;
