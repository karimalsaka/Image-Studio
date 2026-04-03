import { ApiError } from "./errors";

const API_URL = 'http://localhost:4000';

async function request(path: string, options?: RequestInit) {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : undefined;
    console.log(`[API] ${method} ${API_URL}${path}`, body ?? '');

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
    } catch {
        console.error(`[API] ${method} ${path} network error`);
        throw new ApiError('Unable to reach the server. Check your connection.', 0);
    }

    let data;
    try {
        data = await response.json();
    } catch {
        throw new ApiError('Server returned an invalid response.', response.status);
    }

    if (!response.ok) {
        console.error(`[API] ${method} ${path} failed (${response.status}):`, data);
        throw new ApiError(data.error || 'Request failed', response.status);
    }

    console.log(`[API] ${method} ${path} -> ${response.status}`);
    return data;
}

export async function generateImage(prompt: string, size?: string, model?: string, count?: number) {
    return request('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, size, model, count }),
    });
}

export async function createChat(title: string, model: string, userId: string, imageUrl: string) {
    return request('/api/chats', {
        method: 'POST',
        body: JSON.stringify({ title, model, userId, imageUrl }),
    });
}

export async function getChats(userId: string) {
    return request(`/api/chats?userId=${encodeURIComponent(userId)}`);
}

export async function getChat(id: string) {
    return request(`/api/chats/${encodeURIComponent(id)}`);
}

export async function sendMessage(chatId: string, content: string, model?: string) {
    return request(`/api/chats/${encodeURIComponent(chatId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, model }),
    });
}
