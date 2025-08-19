import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    // try {
    //     const { username, email, password } = req.body;
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = new User({ username, email, password: hashedPassword });
    //     await user.save();
    //     res.status(201).json({ message: 'User created' });
    // } catch (err) {
    //     res.status(500).json({ error: err.message });
    // }
    // ret
    console.log('Get root route');
    res.send('Hi maaaaan');
};
