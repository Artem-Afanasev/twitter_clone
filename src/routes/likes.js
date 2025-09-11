import express from 'express';
import {
    likeTweet,
    unlikeTweet,
    checkUserLike,
    getTweetLikes,
    getUserLikes,
} from '../controllers/likes/likeController.js';
import { getLikedTweets } from '../controllers/likes/getLikedTweets.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/:tweetId/like', likeTweet);

router.delete('/:tweetId/like', unlikeTweet);

router.get('/:tweetId/like', checkUserLike);

router.get('/:tweetId/likes', getTweetLikes);

router.get('/user/liked-posts', getLikedTweets);

router.get('/user/likes', getUserLikes);

export default router;
