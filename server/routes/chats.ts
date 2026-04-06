import { Router } from 'express';
import { toErrorResponse } from '../errors';
import { validate } from '../middleware/validate';
import { createChatRequestSchema, sendMessageRequestSchema } from '../schemas';
import ChatController from '../controllers/chatController';

const chatController = new ChatController();
const router = Router();

router.post('/', validate(createChatRequestSchema), async (req, res) => {
    try {
        const chat = await chatController.create(res.locals.userId, req.body);
        res.json(chat);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not create chat. Please try again.');
        res.status(status).json({ error: message });
    }
});

router.get('/', async (_req, res) => {
    try {
        const chats = await chatController.getAll(res.locals.userId);
        res.json(chats);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not load chats. Please try again.');
        res.status(status).json({ error: message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const chat = await chatController.getById(req.params.id as string, res.locals.userId);
        res.json(chat);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not load chat. Please try again.');
        res.status(status).json({ error: message });
    }
});

router.post('/:id/messages', validate(sendMessageRequestSchema), async (req, res) => {
    try {
        const message = await chatController.sendMessage(req.params.id as string, res.locals.userId, req.body);
        res.json(message);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not generate image. Please try again.');
        res.status(status).json({ error: message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await chatController.delete(req.params.id as string, res.locals.userId);
        res.json({ success: true });
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Failed to delete chat');
        res.status(status).json({ error: message });
    }
});

export default router;
