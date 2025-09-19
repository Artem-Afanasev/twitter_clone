import { Tweet as Post, PostImage } from '../../models/index.js';
import { User } from '../../models/index.js';

export const getMyPosts = async (req, res) => {
    try {
        const userId = req.userId;

        const posts = await Post.findAll({
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
                    attributes: ['imageUrl', 'order'],
                },
            ],
            order: [
                ['createdAt', 'DESC'],
                [{ model: PostImage, as: 'images' }, 'order', 'ASC'],
            ],
        });

        const formattedPosts = posts.map((post) => {
            const postData = post.toJSON();
            console.log('Post data:', postData);

            if (
                postData.user &&
                postData.user.avatar &&
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
            }

            return postData;
        });

        res.json(formattedPosts);
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        res.status(500).json({ error: 'Ошибка при загрузке постов' });
    }
};
