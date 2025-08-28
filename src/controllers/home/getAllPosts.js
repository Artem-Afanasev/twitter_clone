import Tweet from '../../models/Post.js';
import User from '../../models/Users.js';

export const getAllPosts = async (req, res) => {
    try {
        const userId = req.userId;

        console.log('🔄 Получение всех постов для пользователя:', userId);

        const posts = await Tweet.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: 100,
        });

        console.log('✅ Найдено постов:', posts.length);

        res.json(posts);
    } catch (error) {
        console.error('❌ Ошибка при получении постов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке ленты' });
    }
};
