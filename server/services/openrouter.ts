export async function generateImage(prompt: string, size: string ='1:1', model: string = 'google/gemini-2.5-flash-image') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            modalities: ['image', 'text'],
            image_config: {
                aspect_ratio: size,
            },
        }),
    })
         
    const data = await response.json();
    console.log('OpenRouter response:', data);

    if (!response.ok) {
        throw new Error(data.error?.message || JSON.stringify(data));
    }

    return data
}