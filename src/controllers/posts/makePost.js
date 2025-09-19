import { Tweet as Post, PostImage } from '../../models/index.js';
import { User } from '../../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const makePostfunc = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.userId;

        if (!content || content.trim().length === 0) {
            return res
                .status(400)
                .json({ error: 'Текст твита не может быть пустым' });
        }

        if (content.length > 280) {
            return res
                .status(400)
                .json({ error: 'Твит не может превышать 280 символов' });
        }

        const tweet = await Post.create({
            content: content.trim(),
            userId: userId,
        });

        const imagePaths = [];

        if (req.files) {
            let images = [];

            if (Array.isArray(req.files.images)) {
                images = req.files.images;
            } else if (req.files.images) {
                images = [req.files.images];
            }

            const uploadDir = path.join(__dirname, '../../../uploads/posts');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                const allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                ];
                if (!allowedTypes.includes(image.mimetype)) {
                    console.log(
                        'Пропущен невалидный тип файла:',
                        image.mimetype
                    );
                    continue;
                }

                if (image.size > 5 * 1024 * 1024) {
                    console.log('Пропущен большой файл:', image.size);
                    continue;
                }

                const fileExtension = path.extname(image.name);
                const fileName = `post_${
                    tweet.id
                }_${Date.now()}_${i}${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                await image.mv(filePath);
                const imagePath = `/uploads/posts/${fileName}`;

                await PostImage.create({
                    imageUrl: imagePath,
                    tweetId: tweet.id,
                    order: i,
                });

                imagePaths.push(imagePath);
            }
        }
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'avatar'],
        });

        const images = await PostImage.findAll({
            where: { tweetId: tweet.id },
            order: [['order', 'ASC']],
        });

        let userAvatar = user.avatar;
        if (userAvatar && !userAvatar.startsWith('http')) {
            userAvatar = `http://localhost:5000${userAvatar}`;
        }

        const formattedImages = images.map((img) => {
            let url = img.imageUrl;
            if (url && !url.startsWith('http')) {
                url = `http://localhost:5000${url}`;
            }
            return url;
        });

        res.status(201).json({
            message: 'Твит успешно создан',
            tweet: {
                id: tweet.id,
                content: tweet.content,
                images: formattedImages,
                createdAt: tweet.createdAt,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: userAvatar,
                },
            },
        });
    } catch (error) {
        console.error('Ошибка при создании твита:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
