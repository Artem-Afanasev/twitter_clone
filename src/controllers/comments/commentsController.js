import { Comment, Tweet, User } from '../../models/index.js';

export const getComments = async (req, res) => {
    try {
        const { tweetId } = req.params;

        console.log('🔄 GET Comments - UserId:', req.userId); // для отладки

        const tweet = await Tweet.findByPk(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: 'Твит не найден' });
        }

        const comments = await Comment.findAll({
            where: { tweetId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(comments);
    } catch (error) {
        console.error('Ошибка при получении комментариев:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const postComment = async (req, res) => {
    try {
        console.log('🔄 POST Comment - Params:', req.params);
        console.log('🔄 POST Comment - Body:', req.body);
        console.log('🔄 POST Comment - User:', req.user);

        const { tweetId } = req.params;
        const { comment } = req.body;
        const userId = req.userId;

        if (!comment || comment.trim().length === 0) {
            return res
                .status(400)
                .json({ error: 'Комментарий не может быть пустым' });
        }

        if (comment.length > 280) {
            return res
                .status(400)
                .json({ error: 'Комментарий слишком длинный' });
        }

        const tweet = await Tweet.findByPk(tweetId);
        if (!tweet) {
            return res.status(404).json({ error: 'Твит не найден' });
        }

        const newComment = await Comment.create({
            comment: comment.trim(),
            userId,
            tweetId,
        });

        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        console.error('Ошибка при создании комментария:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
