import User from '../../models/Users.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'createdAt', 'avatar'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Простое преобразование пути в URL
        let avatarUrl = user.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http')) {
            // Если путь начинается с /, просто добавляем домен
            avatarUrl = `http://localhost:5000${avatarUrl}`;
        }

        res.status(200).json({
            message: '✅ User profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: avatarUrl,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;
        let avatarPath = undefined;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Обработка загруженного аватара
        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar;

            // Проверяем тип файла
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            if (!allowedTypes.includes(avatar.mimetype)) {
                return res
                    .status(400)
                    .json({ error: 'Недопустимый тип файла' });
            }

            // Путь для сохранения - исправляем путь
            const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

            // Проверяем существование папки
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileExtension = path.extname(avatar.name);
            const fileName = `user_${userId}_${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            // Сохраняем файл
            await avatar.mv(filePath);
            avatarPath = `/uploads/avatars/${fileName}`;
        }

        // Обновляем поля
        if (username) user.username = username;
        if (email) user.email = email;
        if (avatarPath !== undefined) user.avatar = avatarPath;

        await user.save();

        // Формируем URL для ответа
        let avatarUrl = user.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http')) {
            avatarUrl = `http://localhost:5000${avatarUrl}`;
        }

        res.status(200).json({
            message: '✅ User profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: avatarUrl,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res
                .status(400)
                .json({ error: 'Email or username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};
