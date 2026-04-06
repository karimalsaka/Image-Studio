import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import generateRoutes from './routes/generate';
import chatRoutes from './routes/chats';
import authRoutes from './routes/auth';
import { authMiddleware } from "./middleware/auth";
import { generalLimiter, authLimiter, generateLimiter } from "./middleware/rateLimit";
import logger from './logger';

dotenv.config({ path: './server/.env' });

// Validate required env vars
const required = ['OPENROUTER_API_KEY', 'DATABASE_URL', 'S3_BUCKET_NAME', 'AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'JWT_SECRET', 'CLIENT_URL'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

const app = express();
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

// Request logging
app.use((req, res, next) => {
    const start = Date.now();

    let logBody = req.body;
    if (req.method !== 'GET' && logBody) {
        const { password, ...safe } = logBody;
        logBody = safe;
    }

    logger.info(`--> ${req.method} ${req.path}`, { body: req.method === 'GET' ? req.query : logBody });
    res.on('finish', () => {
        logger.info(`<-- ${req.method} ${req.path} ${res.statusCode}`, { duration: `${Date.now() - start}ms` });
    });
    next();
});

app.use('/api/generate', authMiddleware, generateLimiter, generateRoutes);
app.use('/api/chats', authMiddleware, chatRoutes);
app.use('/api/auth', authLimiter, authRoutes);

app.listen(4000, () => {
    logger.info('Server running on http://localhost:4000');
});
