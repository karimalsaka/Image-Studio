import { AuthResponse } from "./schemas";

export interface AuthResult {
    user: AuthResponse['user'];
    token: string;
}

