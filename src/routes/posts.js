import express from 'express';
import { makePostfunc } from '../controllers/posts/makePost.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, makePostfunc);

export default router;
