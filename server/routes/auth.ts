import { Router } from 'express'
import prisma from '../db'
import { AppError, toErrorResponse } from '../errors' 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
    }

    try {
        const existing = await prisma.user.findUnique({
            where: { email }
        })
        
        if (existing) {
            throw new AppError("Email already in use", 409)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch(error) {
        const { status, message } = toErrorResponse(error, "Couldn't create account. Please try again")
        res.status(status).json({ error: message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password"})
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        
        if (!user) {
            throw new AppError("Invalid email or password", 401)
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new AppError("Invalid email or password", 401)
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d'})
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch(error) {
        const { status, message } = toErrorResponse(error, "Couldn't log in. Please try again.")
        res.status(status).json({ error: message })
    }
})

export default router;
