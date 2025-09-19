import express from 'express';
import {
    subscribe,
    unsubscribe,
    checkSubscription,
    getFollowing,
    getFollowers,
    getSubscriptionStats,
    getFollowingPosts,
} from '../controllers/likes/subscriptionController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

router.get('/check/:targetUserId', checkSubscription);
router.get('/following/:userId', getFollowing);
router.get('/following', getFollowing);
router.get('/followers/:userId', getFollowers);
router.get('/followers', getFollowers);
router.get('/stats/:userId', getSubscriptionStats);
router.get('/following-posts', getFollowingPosts);

export default router;
