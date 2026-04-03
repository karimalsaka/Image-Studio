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
    console.log(`[OpenRouter] --> ${model} | ${messages.length} messages | size: ${size}`);
    console.log(`[OpenRouter] messages:`, JSON.stringify(loggableMessages, null, 2));
}

function logResponse(status: number, data: Record<string, unknown>) {
    if (status >= 400) {
        console.error(`[OpenRouter] <-- ${status} ERROR:`, data);
        return;
    }
    const choices = data.choices as { message: { images?: unknown[]; content?: string } }[] | undefined;
    const hasImage = (choices?.[0]?.message?.images?.length ?? 0) > 0;
    const text = choices?.[0]?.message?.content;
    console.log(`[OpenRouter] <-- ${status} | image: ${hasImage} | text: ${text ? String(text).slice(0, 100) : 'none'} | usage:`, data.usage);
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
        throw new Error(data.error?.message || JSON.stringify(data));
    }

    return data
}