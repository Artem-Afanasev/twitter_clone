import { Like, Tweet } from '../../models/index.js';

export const likeTweet = async (req, res) => {
    try {
        const userId = req.userId;
        const { tweetId } = req.params;

        console.log(`Пользователь ${userId} пытается лайкнуть твит ${tweetId}`);

        const tweet = await Tweet.findByPk(tweetId);
        if (!tweet) {
            console.log('Твит не найден');
            return res.status(404).json({ error: 'Твит не найден' });
        }

        const existingLike = await Like.findOne({
            where: { userId, tweetId },
        });

        if (existingLike) {
            console.log(' Пользователь уже лайкнул этот твит');
            return res.status(400).json({ error: 'Вы уже лайкнули этот твит' });
        }

        const like = await Like.create({
            userId,
            tweetId,
        });

        console.log(' Лайк создан:', like.id);

        const likeCount = await Like.count({ where: { tweetId } });

        res.status(201).json({
            message: 'Твит лайкнут',
            likeId: like.id,
            likeCount: likeCount,
        });
    } catch (error) {
        console.error(' Ошибка при лайке твита:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const unlikeTweet = async (req, res) => {
    try {
        const userId = req.userId;
        const { tweetId } = req.params;

        const like = await Like.findOne({
            where: { userId, tweetId },
        });

        if (!like) {
            console.log(' Лайк не найден');
            return res.status(404).json({ error: 'Лайк не найден' });
        }

        await like.destroy();

        const likeCount = await Like.count({ where: { tweetId } });

        console.log('Лайк удален');

        res.json({
            message: 'Лайк удален',
            likeCount: likeCount,
        });
    } catch (error) {
        console.error(' Ошибка при удалении лайка:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const checkUserLike = async (req, res) => {
    try {
        const userId = req.userId;
        const { tweetId } = req.params;

        const like = await Like.findOne({
            where: { userId, tweetId },
        });

        res.json({
            liked: !!like,
            likeId: like ? like.id : null,
        });
    } catch (error) {
        console.error(' Ошибка при проверке лайка:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getTweetLikes = async (req, res) => {
    try {
        const { tweetId } = req.params;

        const likeCount = await Like.count({ where: { tweetId } });

        res.json({ likeCount });
    } catch (error) {
        console.error(' Ошибка при получении лайков:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const getUserLikes = async (req, res) => {
    try {
        const userId = req.userId;

        const likes = await Like.findAll({
            where: { userId },
            include: [
                {
                    model: Tweet,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'avatar'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(likes);
    } catch (error) {
        console.error(' Ошибка при получении лайков пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
