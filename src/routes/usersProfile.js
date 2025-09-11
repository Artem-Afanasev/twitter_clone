import express from 'express';
import { getUserProfile } from '../controllers/profile/getUserProfile.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateToken, getUserProfile);

export default router;
