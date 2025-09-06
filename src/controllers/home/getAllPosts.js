import { User, Tweet, PostImage } from '../../models/index.js';

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Tweet.findAll({
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
            limit: 100,
        });

        console.log('📊 Найдено постов:', posts.length); // Добавим отладку

        const formattedPosts = posts.map((post) => {
            const postData = post.toJSON();

            // Отладочная информация
            console.log(`📝 Пост ${postData.id}:`, {
                content: postData.content,
                user: postData.user?.username,
                imagesCount: postData.images?.length,
                images: postData.images,
            });

            // Форматируем аватар
            if (
                postData.user &&
                postData.user.avatar &&
                !postData.user.avatar.startsWith('http')
            ) {
                postData.user.avatar = `http://localhost:5000${postData.user.avatar}`;
            }

            // Форматируем изображения поста
            if (postData.images && postData.images.length > 0) {
                postData.images = postData.images.map((img) => {
                    let url = img.imageUrl;
                    if (url && !url.startsWith('http')) {
                        url = `http://localhost:5000${url}`;
                    }
                    return url;
                });

                console.log(
                    '🖼️ Отформатированные изображения:',
                    postData.images
                );
            }

            return postData;
        });

        res.json(formattedPosts);
    } catch (error) {
        console.error('❌ Ошибка при загрузке ленты:', error);
        res.status(500).json({ error: 'Ошибка при загрузке ленты' });
    }
};
