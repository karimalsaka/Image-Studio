import { AppError } from '../errors';
import logger from '../logger';

export interface ChatMessage {
    role: string;
    content: string | ChatMessageContent[];
}

interface ChatMessageContent {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
}

function logRequest(model: string, messages: ChatMessage[], size: string) {
    const loggableMessages = messages.map(m => {
        if (typeof m.content === 'string') return m;
        return {
            ...m,
            content: m.content.map(c =>
                c.type === 'image_url' && c.image_url?.url
                    ? { ...c, image_url: { url: c.image_url.url.slice(0, 60) + '...' } }
                    : c
            ),
        };
    });
    logger.info(`[OpenRouter] --> ${model} | ${messages.length} messages | size: ${size}`);
    logger.debug('[OpenRouter] messages', { messages: loggableMessages });
}

function logResponse(status: number, data: Record<string, unknown>) {
    if (status >= 400) {
        logger.error(`[OpenRouter] <-- ${status} ERROR`, { data });
        return;
    }
    const choices = data.choices as { message: { images?: unknown[]; content?: string } }[] | undefined;
    const hasImage = (choices?.[0]?.message?.images?.length ?? 0) > 0;
    const text = choices?.[0]?.message?.content;
    logger.info(`[OpenRouter] <-- ${status} | image: ${hasImage} | text: ${text ? String(text).slice(0, 100) : 'none'}`, { usage: data.usage });
}

export async function generateImage(
    prompt: string,
    size: string ='1:1',
    model: string = 'google/gemini-2.5-flash-image',
    messageHistory?: ChatMessage[]
) {
    const messages = messageHistory || [{ role: 'user', content: prompt}];

    logRequest(model, messages, size);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            modalities: ['image', 'text'],
            image_config: {
                aspect_ratio: size,
            },
        }),
    })

    const data = await response.json();
    logResponse(response.status, data);

    if (!response.ok) {
        const apiMessage = data.error?.message;
        if (response.status === 429) {
            throw new AppError('Rate limit exceeded. Please wait a moment and try again.', 429);
        }
        if (response.status === 402) {
            throw new AppError('API quota exceeded. Check your OpenRouter account.', 402);
        }
        if (response.status === 400) {
            throw new AppError(apiMessage || 'The model rejected this request. Try a different prompt.', 400);
        }
        // Unknown API errors — log full details but give user a clean message
        throw new AppError(apiMessage || 'Image generation failed. Please try again.', response.status);
    }

    return data
}