import { Router } from 'express';
import { generateImage } from '../services/openrouter';
import { uploadImage } from '../services/storage';
import { AppError, toErrorResponse } from '../errors';

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

    try {
        const results = await Promise.allSettled(
            modelList.map((model: string) =>
                generateImage(prompt, size, model).then(async (data) => {
                    const images = data.choices?.[0]?.message?.images;
                    if (!images || images.length === 0) {
                        throw new AppError('Model did not return an image. Try a different prompt.');
                    }
                    const base64ImageUrl = images[0].image_url.url;
                    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
                    const imageUrl = await uploadImage(base64ImageUrl, filename);
                    return { imageUrl, model, modelLabel: MODEL_LABELS[model] || model };
                })
            )
        );

        const images = results
            .filter((r): r is PromiseFulfilledResult<{ imageUrl: string; model: string; modelLabel: string }> => r.status === 'fulfilled')
            .map(r => r.value);

        if (images.length === 0) {
            const firstError = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
            const { status, message } = toErrorResponse(firstError?.reason, 'Image generation failed. Please try again.');
            return res.status(status).json({ error: message });
        }

        res.json({ images });
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Image generation failed. Please try again.');
        res.status(status).json({ error: message });
    }
});

export default router;
