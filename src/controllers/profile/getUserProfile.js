import { User, Tweet, PostImage, Like } from '../../models/index.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.userId;

        console.log(
            `🔄 Получение профиля пользователя ${userId} для пользователя ${currentUserId}`
        );

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'avatar', 'info', 'birthdate'],
            raw: true,
        });

        if (!user) {
            console.log('❌ Пользователь не найден');
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const userPosts = await Tweet.findAll({
            where: { userId: userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'avatar'],
                },
                {
                    model: PostImage,
                    as: 'images',
                    attributes: ['imageUrl'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        console.log(`✅ Найдено постов пользователя: ${userPosts.length}`);

        const userLikes = await Like.findAll({
            where: {
                userId: currentUserId,
                tweetId: userPosts.map((post) => post.id),
            },
            attributes: ['tweetId'],
            raw: true,
        });

        const likedPostIds = userLikes.map((like) => like.tweetId);

        const postsWithLikesCount = await Promise.all(
            userPosts.map(async (post) => {
                const likeCount = await Like.count({
                    where: { tweetId: post.id },
                });

                return {
                    post,
                    likeCount,
                };
            })
        );

        const formattedPosts = postsWithLikesCount.map(
            ({ post, likeCount }) => {
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

                postData.isLiked = likedPostIds.includes(post.id);
                postData.likesCount = likeCount;

                return postData;
            }
        );

        let avatarUrl = user.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http')) {
            avatarUrl = `http://localhost:5000${avatarUrl}`;
        }

        const response = {
            user: {
                id: user.id,
                username: user.username,
                info: user.info,
                birthdate: user.birthdate,
                avatar: avatarUrl,
            },
            posts: formattedPosts,
        };

        console.log(
            `✅ Профиль пользователя ${user.username} успешно загружен`
        );
        res.json(response);
    } catch (error) {
        console.error('❌ Ошибка при получении профиля пользователя:', error);
        res.status(500).json({ error: 'Ошибка при загрузке профиля' });
    }
};
