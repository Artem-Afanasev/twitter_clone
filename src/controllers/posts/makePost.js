import Tweet from '../../models/Post.js'; // Импорт модели твита
import User from '../../models/Users.js'; // Импорт модели пользователя

export const makePostfunc = async (req, res) => {
    try {
        const { content } = req.body; // Получаем текст твита из тела запроса
        const userId = req.userId; // Получаем ID пользователя из middleware аутентификации

        // Проверяем, что контент не пустой
        if (!content || content.trim().length === 0) {
            return res
                .status(400)
                .json({ error: 'Текст твита не может быть пустым' });
        }

        // Проверяем длину твита (макс. 280 символов)
        if (content.length > 280) {
            return res
                .status(400)
                .json({ error: 'Твит не может превышать 280 символов' });
        }

        // Создаем твит в базе данных
        const tweet = await Tweet.create({
            content: content.trim(), // Очищаем от пробелов по краям
            userId: userId, // Связываем твит с пользователем
        });

        // Находим пользователя, чтобы вернуть его данные в ответе
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email'], // Не возвращаем пароль
        });

        // Возвращаем успешный ответ с данными твита
        res.status(201).json({
            message: '✅ Твит успешно создан',
            tweet: {
                id: tweet.id,
                content: tweet.content,
                createdAt: tweet.createdAt,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        console.error('Ошибка при создании твита:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
