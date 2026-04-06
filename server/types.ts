import { AuthResponse } from "./schemas";

export interface AuthResult {
    user: AuthResponse['user'];
    token: string;
}

export interface MessageResult {
    id: string;
    chatId: string;
    role: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
}