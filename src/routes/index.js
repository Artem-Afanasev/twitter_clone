import express from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import makePost from './posts.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/posts', makePost);

export default router;
