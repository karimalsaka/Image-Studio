export async function generateImage(prompt: string) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                model: 'google/gemini-2.5-flash-image',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                modalities: ['image', 'text'],
                n: 1,
                size: '1024x1024',
            }),
    })
         
    const data = await response.json();
    console.log('OpenRouter response:', data);

    if (!response.ok) {
        throw new Error(data.error?.message || JSON.stringify(data));
    }

    return data
}