import express from 'express';
import { register } from '../controllers/auth.js';

const router = express.Router();

router.get('/register', register);
// router.post('/login', login);

export default router;
