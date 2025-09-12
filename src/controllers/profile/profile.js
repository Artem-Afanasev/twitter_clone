import { User } from '../../models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId, {
            attributes: [
                'id',
                'username',
                'email',
                'createdAt',
                'avatar',
                'info',
                'birthdate',
            ],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let avatarUrl = user.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http')) {
            avatarUrl = `http://localhost:5000${avatarUrl}`;
        }

        res.status(200).json({
            message: '✅ User profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: avatarUrl,
                info: user.info,
                birthdate: user.birthdate,
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

        const { username, info, birthdate } = req.body;
        let avatarPath = undefined;

        console.log('📦 Received form data:', { username, info, birthdate });
        console.log('📁 Files:', req.files);

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.files && req.files.avatar) {
            const avatar = req.files.avatar;

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

            const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileExtension = path.extname(avatar.name);
            const fileName = `user_${userId}_${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            await avatar.mv(filePath);
            avatarPath = `/uploads/avatars/${fileName}`;
        }

        if (username !== undefined) user.username = username;
        if (info !== undefined) user.info = info;
        if (birthdate !== undefined) user.birthdate = birthdate;
        if (avatarPath !== undefined) user.avatar = avatarPath;

        await user.save();

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
                info: user.info,
                birthdate: user.birthdate,
                avatar: avatarUrl,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};
