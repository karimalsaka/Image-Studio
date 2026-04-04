import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Authentication required"})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        res.locals.userId = decoded.userId
        next()
    } catch(error) {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}