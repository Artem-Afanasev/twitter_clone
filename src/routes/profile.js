import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile/profile.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);

export default router;
