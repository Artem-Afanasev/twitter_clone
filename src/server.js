import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 5000;

sequelize
    .sync({ force: false })
    .then(() => {
        console.log('✅ Database synced');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
    });
