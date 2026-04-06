import { Router } from 'express';
import { validate } from '../middleware/validate';
import { generateRequestSchema } from '../schemas';
import GenerateController from '../controllers/generateController';

const generateController = new GenerateController();
const router = Router();

router.post('/', validate(generateRequestSchema), async (req, res) => {
    const { prompt, size, models } = req.body;

    // SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let completed = 0;
    let closed = false;

    req.on('close', () => { closed = true; });

    await generateController.generate(prompt, size, models, (event) => {
        if (!closed) res.write(`data: ${JSON.stringify(event)}\n\n`);
        completed++;
        const total = models?.length || 1;
        if (completed === total && !closed) {
            res.write('data: [DONE]\n\n');
            res.end();
        }
    });
});

export default router;
