import express from 'express';
import cors from 'cors';
import mainRoute from './routes/index.js';
import {
    fileUploadMiddleware,
    staticFilesMiddleware,
} from './middleware/uploadMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());

app.use(fileUploadMiddleware);

console.log(
    '🔄 Serving static files from:',
    path.join(__dirname, '../uploads')
);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/debug-avatar', (req, res) => {
    const fs = require('fs');
    const avatarPath = path.join(
        __dirname,
        '../uploads/avatars/user_1756798319334.jpg'
    );

    console.log('🔍 Checking file at:', avatarPath);
    console.log('File exists:', fs.existsSync(avatarPath));

    if (fs.existsSync(avatarPath)) {
        res.sendFile(avatarPath);
    } else {
        res.status(404).json({
            error: 'File not found',
            path: avatarPath,
            currentDir: __dirname,
        });
    }
});

app.use(mainRoute);

export default app;
