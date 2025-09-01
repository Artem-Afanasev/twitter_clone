import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        await sequelize.sync({ force: false });
        console.log('✅ Database synced');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(
                `📁 Static files available at: http://localhost:${PORT}/uploads`
            );
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
