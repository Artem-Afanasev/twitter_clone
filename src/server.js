import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server is running'));

// mongoose
//     .connect('mongodb://localhost:27017/twitter-clone')
//     .then(() => {
//         console.log('✅ Connected to DB');
//         app.listen(PORT, () =>
//             console.log(`🚀 Server running on port ${PORT}`)
//         );
//     })
//     .catch((err) => console.error('❌ DB connection error:', err));
