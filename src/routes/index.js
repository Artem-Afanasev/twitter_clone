import express from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profile.js';
import postRoutes from './posts.js';
import homeRoutes from './home.js';
import likeRoutes from './likes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/posts', postRoutes);
router.use('/home', homeRoutes);
router.use('/likes', likeRoutes);

export default router;
