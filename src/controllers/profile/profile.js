import User from '../../models/Users.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Предполагается, что userId добавляется в req через middleware аутентификации

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'createdAt'], // Исключаем пароль и другие чувствительные данные
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: '✅ User profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Обновляем только разрешенные поля
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            message: '✅ User profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
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
