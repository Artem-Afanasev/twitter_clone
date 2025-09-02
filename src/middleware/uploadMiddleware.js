// middleware/uploadMiddleware.js
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// АБСОЛЮТНЫЙ путь к папке uploads
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Создаем папки для загрузок
const uploadDirs = [
    UPLOADS_DIR,
    path.join(UPLOADS_DIR, 'avatars'),
    path.join(UPLOADS_DIR, 'avatars/default'),
];

uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

console.log('📁 Uploads directory:', UPLOADS_DIR);

// Middleware для загрузки файлов
export const fileUploadMiddleware = fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
});

// Middleware для статических файлов - исправляем путь
export const staticFilesMiddleware = express.static(UPLOADS_DIR);

export default { fileUploadMiddleware, staticFilesMiddleware };
