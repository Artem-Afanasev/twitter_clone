import { User } from '../../models/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
    try {
        const { username, email, password, birthdate } = req.body;
        let avatarPath = '';

        if (birthdate) {
            const birthDate = new Date(birthdate);
            const currentDate = new Date();

            if (birthDate >= currentDate) {
                return res.status(400).json({
                    error: 'Дата рождения должна быть в прошлом',
                });
            }

            const minAgeDate = new Date();
            minAgeDate.setFullYear(currentDate.getFullYear() - 13);

            if (birthDate > minAgeDate) {
                return res.status(400).json({
                    error: 'Пользователь должен быть старше 13 лет',
                });
            }

            const maxAgeDate = new Date();
            maxAgeDate.setFullYear(currentDate.getFullYear() - 120);

            if (birthDate < maxAgeDate) {
                return res.status(400).json({
                    error: 'Пожалуйста, укажите реальную дату рождения',
                });
            }
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

            // ИСПРАВЛЕННЫЙ ПУТЬ - используем корневую папку uploads
            const uploadDir = path.join(process.cwd(), 'uploads', 'avatars'); // ← Исправлено!

            // Убедимся что папка существует
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileExtension = path.extname(avatar.name);
            const fileName = `user_${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            await avatar.mv(filePath);
            avatarPath = `/uploads/avatars/${fileName}`; // ← Путь для БД
        }

        const user = await User.create({
            username,
            email,
            password,
            birthdate: birthdate || null,
            avatar: avatarPath,
        });

        res.status(201).json({
            message: '✅ User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                birthdate: user.birthdate,
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
