import { Router } from 'express';
import { generateImage } from '../services/openrouter';
import { uploadImage } from '../services/storage';

const router = Router();

router.post('/', async (req, res) => {
    const { prompt, size, model, count = 1 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    const n = Math.min(Math.max(Number(count) || 1, 1), 5);

    try {
        // Fire all generations in parallel
        const results = await Promise.all(
            Array.from({ length: n }, () =>
                generateImage(prompt, size, model).then(async (data) => {
                    const images = data.choices?.[0]?.message?.images;
                    if (!images || images.length === 0) {
                        throw new Error('Model did not return an image');
                    }
                    const base64ImageUrl = images[0].image_url.url;
                    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
                    return uploadImage(base64ImageUrl, filename);
                })
            )
        );

        res.json({ imageUrls: results });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate image';
        console.error('Error:', error);
        res.status(500).json({ error: message });
    }
});

export default router;
