import { Router } from 'express';
import { generateImage } from '../services/openrouter';
import { uploadImage } from '../services/storage';
import { AppError } from '../errors';

const MODEL_LABELS: Record<string, string> = {
    'google/gemini-2.5-flash-image': 'Nano Banana (Gemini 2.5 Flash)',
    'google/gemini-3.1-flash-image-preview': 'Nano Banana 2 (Gemini 3.1 Flash)',
    'google/gemini-3-pro-image-preview': 'Nano Banana Pro (Gemini 3 Pro)',
    'openai/gpt-5-image-mini': 'GPT-5 Image Mini',
    'openai/gpt-5-image': 'GPT-5 Image',
};

const router = Router();

router.post('/', async (req, res) => {
    const { prompt, size, models } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    const modelList: string[] = Array.isArray(models) && models.length > 0
        ? models
        : ['google/gemini-2.5-flash-image'];

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let completed = 0;
    const total = modelList.length;
    let closed = false;

    req.on('close', () => { closed = true; });

    const write = (data: string) => {
        if (!closed) res.write(data);
    };

    const promises = modelList.map((model: string) =>
        generateImage(prompt, size, model)
            .then(async (data) => {
                const images = data.choices?.[0]?.message?.images;
                if (!images || images.length === 0) {
                    throw new AppError('Model did not return an image.');
                }
                const base64ImageUrl = images[0].image_url.url;
                const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
                const imageUrl = await uploadImage(base64ImageUrl, filename);

                write(`data: ${JSON.stringify({
                    type: 'image',
                    model,
                    modelLabel: MODEL_LABELS[model] || model,
                    imageUrl,
                })}\n\n`);
            })
            .catch((err) => {
                const message = err instanceof AppError ? err.message : 'Generation failed';
                write(`data: ${JSON.stringify({
                    type: 'error',
                    model,
                    modelLabel: MODEL_LABELS[model] || model,
                    error: message,
                })}\n\n`);
            })
            .finally(() => {
                completed++;
                if (completed === total && !closed) {
                    res.write('data: [DONE]\n\n');
                    res.end();
                }
            })
    );

    await Promise.allSettled(promises);
});

export default router;
