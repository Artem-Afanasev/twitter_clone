import { User } from '../../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let avatarPath = '';

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

            const uploadDir = path.join(__dirname, '../uploads/avatars');
            const fileExtension = path.extname(avatar.name);
            const fileName = `user_${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            await avatar.mv(filePath);
            avatarPath = `/uploads/avatars/${fileName}`;
        }

        const user = await User.create({
            username,
            email,
            password,
            avatar: avatarPath,
        });

        res.status(201).json({
            message: '✅ User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};
