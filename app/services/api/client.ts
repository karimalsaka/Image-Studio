import { ApiError } from "../errors";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isDev = process.env.NODE_ENV === 'development';

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
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
