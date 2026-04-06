import { ApiError } from "../errors";
import { API_URL } from "./client";

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
