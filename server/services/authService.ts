import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import UserRepository from "../repositories/userRepository"
import { SignupRequest, LoginRequest } from "../schemas"
import { AuthResult } from "../types"
import { AppError } from '../errors' 

class AuthService {

    constructor(private userRepository: UserRepository = new UserRepository()) {}

    async signUp(data: SignupRequest): Promise<AuthResult> {
        const existing = await this.userRepository.findByEmail(data.email)
        
        if (existing) {
            throw new AppError("Email already in use", 409)
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        const tempId = crypto.randomUUID();
        const token = jwt.sign({ userId: tempId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        const user = await this.userRepository.create({
            id: tempId,
            email: data.email,
            name: data.name ?? null,
            password: hashedPassword
        })

        return {
            user: { id: user.id, email: user.email, name: user.name },
            token
        }
    }

    async login(data: LoginRequest): Promise<AuthResult> {
        const user = await this.userRepository.findByEmail(data.email)
        if (user == null) {
            throw new AppError('Invalid email or password', 401)
        }

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
            throw new AppError("Invalid email or password", 401)
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d'})


        return {
            user: { id: user.id, email: user.email, name: user.name },
            token
        }
    }
}

export default AuthService