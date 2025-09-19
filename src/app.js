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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(mainRoute);

export default app;
