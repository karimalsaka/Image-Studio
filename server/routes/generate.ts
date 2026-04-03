import { Router } from 'express';
import { generateImage } from '../services/openrouter';
import { uploadImage } from '../services/storage';
import { AppError, toErrorResponse } from '../errors';

const router = Router();

router.post('/', async (req, res) => {
    const { prompt, size, model, count = 1 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    const n = Math.min(Math.max(Number(count) || 1, 1), 5);

    try {
        const results = await Promise.allSettled(
            Array.from({ length: n }, () =>
                generateImage(prompt, size, model).then(async (data) => {
                    const images = data.choices?.[0]?.message?.images;
                    if (!images || images.length === 0) {
                        throw new AppError('Model did not return an image. Try a different prompt.');
                    }
                    const base64ImageUrl = images[0].image_url.url;
                    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
                    return uploadImage(base64ImageUrl, filename);
                })
            )
        );

        const imageUrls = results
            .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
            .map(r => r.value);

        if (imageUrls.length === 0) {
            const firstError = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
            const { status, message } = toErrorResponse(firstError?.reason, 'Image generation failed. Please try again.');
            return res.status(status).json({ error: message });
        }

        res.json({ imageUrls });
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Image generation failed. Please try again.');
        res.status(status).json({ error: message });
    }
});

export default router;
