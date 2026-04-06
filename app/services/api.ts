import { ApiError } from "./errors";
import type { Chat, Message } from "@/app/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isDev = process.env.NODE_ENV === 'development';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const method = options?.method || 'GET';

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            ...options,
        });
    } catch {
        throw new ApiError('Unable to reach the server. Check your connection.', 0);
    }

    let data: T;
    try {
        data = await response.json();
    } catch {
        throw new ApiError('Server returned an invalid response.', response.status);
    }

    if (!response.ok) {
        const errorData = data as unknown as { error?: string };
        if (isDev) console.error(`[API] ${method} ${path} failed (${response.status}):`, data);
        throw new ApiError(errorData.error || 'Request failed', response.status);
    }

    return data;
}

// ── Stream types ──

export interface StreamedImage {
    type: 'image';
    model: string;
    modelLabel: string;
    imageUrl: string;
}

export interface StreamedError {
    type: 'error';
    model: string;
    modelLabel: string;
    error: string;
}

export type StreamEvent = StreamedImage | StreamedError;

// ── Auth ──

interface AuthResponse {
    user: { id: string; email: string; name: string | null };
}

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

// ── Generate ──

export async function generateImageStream(
    prompt: string,
    size: string,
    models: string[],
    onEvent: (event: StreamEvent) => void,
): Promise<void> {
    let response: Response;
    try {
        response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ prompt, size, models }),
        });
    } catch {
        throw new ApiError('Unable to reach the server. Check your connection.', 0);
    }

    if (!response.ok) {
        let data: { error?: string } = {};
        try { data = await response.json(); } catch { /* empty */ }
        throw new ApiError(data.error || 'Request failed', response.status);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new ApiError('Streaming not supported.', 0);

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const payload = trimmed.slice(6);
            if (payload === '[DONE]') return;

            try {
                const event = JSON.parse(payload) as StreamEvent;
                onEvent(event);
            } catch {
                // skip malformed lines
            }
        }
    }
}

// ── Chats ──

export async function createChat(title: string, model: string, imageUrl: string): Promise<Chat> {
    return request<Chat>('/chats', {
        method: 'POST',
        body: JSON.stringify({ title, model, imageUrl }),
    });
}

export async function getChats(): Promise<Chat[]> {
    return request<Chat[]>('/chats');
}

export async function getChat(id: string): Promise<Chat> {
    return request<Chat>(`/chats/${encodeURIComponent(id)}`);
}

export async function deleteChat(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/chats/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
}

export async function sendMessage(chatId: string, content: string, model?: string, size?: string): Promise<Message> {
    return request<Message>(`/chats/${encodeURIComponent(chatId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, model, size }),
    });
}
