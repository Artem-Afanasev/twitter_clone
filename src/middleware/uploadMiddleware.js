// middleware/uploadMiddleware.js
import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаем папки для загрузок
const uploadDirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/avatars'),
    path.join(__dirname, '../uploads/avatars/default'),
];

uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Middleware для загрузки файлов
export const fileUploadMiddleware = fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
});

// Middleware для статических файлов
export const staticFilesMiddleware = express.static(
    path.join(__dirname, '../uploads')
);

export default { fileUploadMiddleware, staticFilesMiddleware };
