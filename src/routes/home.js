import express from 'express';
import { getAllPosts } from '../controllers/home/getAllPosts.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPosts);

export default router;
