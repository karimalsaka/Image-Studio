import { ApiError } from "./errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function request(path: string, options?: RequestInit) {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : undefined;
    console.log(`[API] ${method} ${API_URL}${path}`, body ?? '');

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            headers: { 
                'Content-Type': 'application/json' ,
            },
            credentials: 'include',
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

export async function generateImage(prompt: string, size?: string, models?: string[]) {
    return request('/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, size, models }),
    });
}

export async function createChat(title: string, model: string, imageUrl: string) {
    return request('/chats', {
        method: 'POST',
        body: JSON.stringify({ title, model, imageUrl }),
    });
}

export async function getChats() {
    return request(`/chats`);
}

export async function getChat(id: string) {
    return request(`/chats/${encodeURIComponent(id)}`);
}

export async function deleteChat(id: string) {
    return request(`/chats/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });
}

export async function sendMessage(chatId: string, content: string, model?: string, size?: string) {
    return request(`/chats/${encodeURIComponent(chatId)}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, model, size }),
    });
}

export async function signUp(email: string, name: string, password: string) {
    return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({email, name, password})
    });
}

export async function logIn(email: string, password: string) {
    return request("/auth/login", {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export async function logOut() {
    return request('/auth/logout', {
        method: 'POST'
        })
}

