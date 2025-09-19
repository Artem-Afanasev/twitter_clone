import { Tweet } from '../../models/index.js';

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Tweet.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: 'Твит не найден',
            });
        }

        if (post.userId !== userId) {
            return res.status(403).json({
                error: 'Нельзя удалить чужой твит',
            });
        }

        await post.destroy();

        console.log('Твит удален:', postId);
        res.json({ message: 'Твит успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении твита:', error);
        res.status(500).json({ error: 'Ошибка при удалении твита' });
    }
};
