import {
    User,
    Subscription,
    Like,
    Tweet,
    PostImage,
} from '../../models/index.js';

export const subscribe = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const followerId = req.userId;

        if (!targetUserId) {
            return res.status(400).json({
                error: 'ID целевого пользователя обязателен',
            });
        }

        if (followerId === targetUserId) {
            return res.status(400).json({
                error: 'Нельзя подписаться на самого себя',
            });
        }

        const targetUser = await User.findByPk(targetUserId);
        if (!targetUser) {
            return res.status(404).json({
                error: 'Пользователь не найден',
            });
        }

        const currentUser = await User.findByPk(followerId);
        if (!currentUser) {
            return res.status(404).json({
                error: 'Текущий пользователь не найден',
            });
        }

        const existingSubscription = await Subscription.findOne({
            where: {
                followerId: followerId,
                followingId: targetUserId,
            },
        });

        if (existingSubscription) {
            return res.status(400).json({
                error: 'Вы уже подписаны на этого пользователя',
            });
        }

        const subscription = await Subscription.create({
            followerId: followerId,
            followingId: targetUserId,
        });

        res.status(201).json({
            message: 'Вы успешно подписались на пользователя',
            subscription: {
                followerId: subscription.followerId,
                followingId: subscription.followingId,
                targetUser: {
                    id: targetUser.id,
                    username: targetUser.username,
                    avatar: targetUser.avatar,
                },
                createdAt: subscription.createdAt,
            },
        });
    } catch (error) {
        console.error('Ошибка при подписке:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при подписке',
        });
    }
};

export const unsubscribe = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const followerId = req.userId;

        if (!targetUserId) {
            return res.status(400).json({
                error: 'ID целевого пользователя обязателен',
            });
        }

        const subscription = await Subscription.findOne({
            where: {
                followerId: followerId,
                followingId: targetUserId,
            },
        });

        if (!subscription) {
            return res.status(404).json({
                error: 'Подписка не найдена',
            });
        }

        await subscription.destroy();

        res.json({
            message: ' Вы отписались от пользователя',
        });
    } catch (error) {
        console.error(' Ошибка при отписке:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при отписке',
        });
    }
};
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        console.log(`Получение постов подписок для пользователя ${userId}`);

        const subscriptions = await Subscription.findAll({
            where: { followerId: userId },
            attributes: ['followingId'],
            raw: true,
        });

        const followingIds = subscriptions.map((sub) => sub.followingId);

        if (followingIds.length === 0) {
            console.log(' Нет подписок');
            return res.json({
                posts: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
            });
        }

        const { count, rows: posts } = await Tweet.findAndCountAll({
            where: {
                userId: followingIds,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: PostImage,
                    as: 'images',
                    attributes: ['imageUrl'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true,
        });

        const formattedPosts = await Promise.all(
            posts.map(async (post) => {
                try {
                    const likesCount = await Like.count({
                        where: { tweetId: post.id },
                    });

                    const userLike = await Like.findOne({
                        where: {
                            tweetId: post.id,
                            userId: userId,
                        },
                    });

                    const postData = post.toJSON();

                    if (
                        postData.user?.avatar &&
                        !postData.user.avatar.startsWith('http')
                    ) {
                        postData.user.avatar = `http://localhost:5000${postData.user.avatar}`;
                    }

                    if (postData.images && postData.images.length > 0) {
                        postData.images = postData.images.map((img) => {
                            let url = img.imageUrl;
                            if (url && !url.startsWith('http')) {
                                url = `http://localhost:5000${url}`;
                            }
                            return url;
                        });
                    } else {
                        postData.images = [];
                    }

                    postData.likesCount = likesCount;
                    postData.isLiked = !!userLike;

                    return postData;
                } catch (error) {
                    console.error(`Ошибка для поста ${post.id}:`, error);
                    return post.toJSON();
                }
            })
        );

        res.json({
            posts: formattedPosts,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error(' Ошибка при получении постов подписок:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при получении постов подписок',
        });
    }
};
export const checkSubscription = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const followerId = req.userId;

        const subscription = await Subscription.findOne({
            where: {
                followerId: followerId,
                followingId: targetUserId,
            },
            attributes: ['followerId', 'followingId', 'createdAt'],
        });

        res.json({
            subscribed: !!subscription,
        });
    } catch (error) {
        console.error(' Ошибка при проверке подписки:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при проверке подписки',
        });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: User,
                    as: 'following',
                    attributes: ['id', 'username', 'avatar', 'createdAt'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден',
            });
        }

        res.json({
            following: user.following,
        });
    } catch (error) {
        console.error(' Ошибка при получении подписок:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при получении подписок',
        });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId || req.userId;

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: User,
                    as: 'followers',
                    attributes: ['id', 'username', 'avatar', 'createdAt'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                error: 'Пользователь не найден',
            });
        }

        res.json({
            followers: user.followers,
        });
    } catch (error) {
        console.error(' Ошибка при получении подписчиков:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при получении подписчиков',
        });
    }
};

export const getSubscriptionStats = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [followersCount, followingCount] = await Promise.all([
            Subscription.count({ where: { followingId: userId } }),
            Subscription.count({ where: { followerId: userId } }),
        ]);

        res.json({
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error(' Ошибка при получении статистики:', error);
        res.status(500).json({
            error: 'Внутренняя ошибка сервера при получении статистики',
        });
    }
};
