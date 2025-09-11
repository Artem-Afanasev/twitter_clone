import { Sequelize } from 'sequelize';
import { Like, Tweet, User, PostImage } from '../../models/index.js';

export const getLikedTweets = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(`🔄 Получение лайкнутых постов для пользователя ${userId}`);

        // Простой и надежный подход: два отдельных запроса
        const userLikes = await Like.findAll({
            where: { userId },
            attributes: ['tweetId'],
            raw: true,
        });

        const tweetIds = userLikes.map((like) => like.tweetId);

        if (tweetIds.length === 0) {
            console.log('✅ Нет лайкнутых постов');
            return res.json([]);
        }

        // Получаем твиты с пользователями и изображениями
        const likedTweets = await Tweet.findAll({
            where: {
                id: tweetIds,
            },
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

        console.log(`✅ Найдено твитов: ${likedTweets.length}`);

        // Получаем количество лайков для каждого твита
        const postsWithLikes = await Promise.all(
            likedTweets.map(async (tweet) => {
                try {
                    const likesCount = await Like.count({
                        where: { tweetId: tweet.id },
                    });

                    const post = tweet.toJSON();

                    // Форматируем аватар
                    if (
                        post.user?.avatar &&
                        !post.user.avatar.startsWith('http')
                    ) {
                        post.user.avatar = `http://localhost:5000${post.user.avatar}`;
                    }

                    // Форматируем изображения
                    if (post.images && post.images.length > 0) {
                        post.images = post.images.map((img) => {
                            let url = img.imageUrl;
                            if (url && !url.startsWith('http')) {
                                url = `http://localhost:5000${url}`;
                            }
                            return url;
                        });
                    } else {
                        post.images = [];
                    }

                    // Добавляем информацию о лайках
                    post.likesCount = likesCount;
                    post.isLiked = true; // Все эти посты лайкнуты текущим пользователем

                    return post;
                } catch (error) {
                    console.error(`❌ Ошибка для твита ${tweet.id}:`, error);
                    return tweet.toJSON();
                }
            })
        );

        console.log(`✅ Отправляем постов: ${postsWithLikes.length}`);
        res.json(postsWithLikes);
    } catch (error) {
        console.error('❌ Ошибка при получении лайкнутых постов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке лайкнутых постов' });
    }
};
