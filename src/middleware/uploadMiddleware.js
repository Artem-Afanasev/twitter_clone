import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const uploadDirs = [UPLOADS_DIR, path.join(UPLOADS_DIR, 'avatars')];

uploadDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

export const fileUploadMiddleware = fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
    useTempFiles: false,
});

export const staticFilesMiddleware = express.static(UPLOADS_DIR);

export default { fileUploadMiddleware, staticFilesMiddleware };
