import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`Server running, port ${PORT}`);
        });
    } catch (error) {
        console.error('Error', error);
        process.exit(1);
    }
};

startServer();
