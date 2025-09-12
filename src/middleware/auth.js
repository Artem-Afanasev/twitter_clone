import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization header:', authHeader);
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT verify error:', err);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        console.log('Decoded token:', decoded);
        console.log('Decoded userId:', decoded.userId);
        console.log('Type of userId:', typeof decoded.userId);

        // Используем поле userId
        req.userId = decoded.userId;

        if (!req.userId) {
            console.log('Invalid token payload - no userId');
            return res.status(403).json({ error: 'Invalid token payload' });
        }

        console.log('Authentication successful, userId:', req.userId);
        next();
    });
};

export default authenticateToken;
