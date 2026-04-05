import AuthService from "../services/authService";
import { SignupRequest, LoginRequest } from "../schemas";
import { AuthResult } from "../types";

class AuthController {
    constructor(private authService: AuthService = new AuthService()) {}

    async signUp(data: SignupRequest): Promise<AuthResult> {
        return this.authService.signUp(data)
    }
    
    async logIn(data: LoginRequest): Promise<AuthResult> {
        return this.authService.login(data)
    }
}

export default AuthController