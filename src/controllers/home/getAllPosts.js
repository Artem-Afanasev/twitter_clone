import { User } from '../../models/index.js';
import { Tweet } from '../../models/index.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Tweet.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'email', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: 100,
        });

        const postsWithAvatarUrls = posts.map((post) => {
            const postData = post.toJSON();
            if (
                postData.User &&
                postData.User.avatar &&
                !postData.User.avatar.startsWith('http')
            ) {
                postData.User.avatar = `http://localhost:5000${postData.User.avatar}`;
            }
            return postData;
        });

        res.json(postsWithAvatarUrls);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при загрузке ленты' });
    }
};
