import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import generateRoutes from './routes/generate';
import chatRoutes from './routes/chats';
import authRoutes from './routes/auth';

dotenv.config({ path: './server/.env' });

// Validate required env vars
const required = ['OPENROUTER_API_KEY', 'DATABASE_URL', 'S3_BUCKET_NAME', 'AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'JWT_SECRET'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[Server] --> ${req.method} ${req.path}`, req.method === 'GET' ? req.query : req.body);
    res.on('finish', () => {
        console.log(`[Server] <-- ${req.method} ${req.path} ${res.statusCode} (${Date.now() - start}ms)`);
    });
    next();
});

app.use('/api/generate', generateRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes)
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
