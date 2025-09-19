import express from 'express';
import {
    postComment,
    getComments,
} from '../controllers/comments/commentsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:tweetId', authenticateToken, getComments);
router.post('/:tweetId', authenticateToken, postComment);

export default router;
