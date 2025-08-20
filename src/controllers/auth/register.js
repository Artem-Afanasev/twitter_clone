import User from '../../models/Users.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            message: '✅ User created successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};
