import rateLimit from 'express-rate-limit';

// General API rate limit — 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth rate limit — 10 attempts per 15 minutes (prevents brute force)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many login attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Generate rate limit — 20 generations per 15 minutes (protects OpenRouter credits)
export const generateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Generation limit reached. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
