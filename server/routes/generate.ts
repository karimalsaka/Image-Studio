import { Router } from 'express';
import { generateImage } from '../services/openrouter';
import { uploadImage } from '../services/storage';

const router = Router();

router.post('/', async (req, res) => {
    const { prompt, size, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }

    try {
        const data = await generateImage(prompt, size, model);

        const images = data.choices?.[0]?.message?.images;
        if (!images || images.length === 0) {
            throw new Error('Model did not return an image');
        }

        const base64ImageUrl = images[0].image_url.url;
        const filename = `${Date.now()}.png`;
        const s3Url = await uploadImage(base64ImageUrl, filename);

        res.json({ imageUrl: s3Url });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to generate image';
        console.error('Error:', error);
        res.status(500).json({ error: message });
    }
});

export default router;
