// controllers/posts/getPosts.js
import Tweet from '../../models/Post.js';
import User from '../../models/Users.js';

/**
 * Получение постов ТЕКУЩЕГО аутентифицированного пользователя
 */
export const getMyPosts = async (req, res) => {
    try {
        const userId = req.userId; // userId из middleware аутентификации

        console.log('🔄 Получение постов для userId:', userId);

        // Ищем посты пользователя
        const posts = await Tweet.findAll({
            where: { userId: userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']], // новые сначала
        });

        console.log('✅ Найдено постов:', posts.length);
        res.json(posts);
    } catch (error) {
        console.error('❌ Ошибка при получении постов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке постов' });
    }
};
