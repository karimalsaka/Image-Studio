import { Router } from 'express'
import { toErrorResponse } from '../errors' 
import AuthController from '../controllers/authController';
import { validate } from "../middleware/validate"
import { loginRequestSchema, signupRequestSchema } from '../schemas';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const authController = new AuthController()
const router = Router();

router.post('/signup', validate(signupRequestSchema), async (req, res) => { 

    try {
        const result = await authController.signUp(req.body)
        const user = result.user
        res.cookie('token', result.token, COOKIE_OPTIONS);
        res.json({ user });
    } catch(error) {
        const { status, message } = toErrorResponse(error, "Couldn't create account. Please try again");
        res.status(status).json({ error: message });
    }
})

router.post('/login', validate(loginRequestSchema), async (req, res) => {    
    try {
        const result = await authController.logIn(req.body)
        const user = result.user

        res.cookie('token', result.token, COOKIE_OPTIONS);
        res.json({ user });
    } catch(error) {
        const { status, message } = toErrorResponse(error, "Couldn't log in. Please try again.")
        res.status(status).json({ error: message })
    }
})

router.post('/logout', async ( _, res) => {
    res.clearCookie('token')
    res.status(200).json({ 'success': true })
})

export default router;
