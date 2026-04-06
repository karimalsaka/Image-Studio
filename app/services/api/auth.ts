import { request } from "./client";
import type { AuthResponse } from "@/app/shared/types";

export async function signUp(email: string, name: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, name, password }),
    });
}

export async function logIn(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function logOut(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/auth/logout', {
        method: 'POST',
    });
}
