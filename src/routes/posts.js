import express from 'express';
import { makePostfunc } from '../controllers/posts/makePost.js';
import { getMyPosts } from '../controllers/posts/getPosts.js';
import { authenticateToken } from '../middleware/auth.js';
import { deletePost } from '../controllers/posts/deletePost.js';

const router = express.Router();

router.post('/', authenticateToken, makePostfunc);

router.get('/my-posts', authenticateToken, getMyPosts);

router.delete('/:id', authenticateToken, deletePost);

export default router;
