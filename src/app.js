import express from 'express';
import cors from 'cors';
import mainRoute from './routes/index.js';
import {
    fileUploadMiddleware,
    staticFilesMiddleware,
} from './middleware/uploadMiddleware.js';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());

app.use(fileUploadMiddleware);

app.use('/uploads', staticFilesMiddleware);

app.use(mainRoute);

export default app;
