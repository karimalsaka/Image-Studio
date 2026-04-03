import { Router } from 'express';
import { generateImage, type ChatMessage } from '../services/openrouter';
import { uploadImage, imageUrlToBase64 } from '../services/storage';
import prisma from '../db';
import { AppError, toErrorResponse } from '../errors';

const router = Router();

// Create a chat
router.post('/', async (req, res) => {
    const { title, model, userId, imageUrl } = req.body;

    if (!title || !model || !userId || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields: title, model, userId, imageUrl' });
    }

    try {
        const chat = await prisma.chat.create({
            data: {
                title,
                model,
                userId,
                messages: {
                    create: [
                        { role: 'user', content: title },
                        { role: 'assistant', content: '', imageUrl },
                    ],
                },
            },
            include: { messages: true },
        });
        res.json(chat);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not create chat. Please try again.');
        res.status(status).json({ error: message });
    }
});

// Get all chats for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Missing required query param: userId' });
    }

    try {
        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                messages: {
                    where: { role: 'assistant', imageUrl: { not: null } },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { imageUrl: true },
                },
            },
        });

        const result = chats.map(({ messages, ...chat }) => ({
            ...chat,
            thumbnail: messages[0]?.imageUrl ?? null,
        }));

        res.json(result);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not load chats. Please try again.');
        res.status(status).json({ error: message });
    }
});

// Get a single chat with messages
router.get('/:id', async (req, res) => {
    try {
        const chat = await prisma.chat.findUnique({
            where: { id: req.params.id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not load chat. Please try again.');
        res.status(status).json({ error: message });
    }
});

// Send a message in a chat
router.post('/:id/messages', async (req, res) => {
    const { content, model } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Missing required field: content' });
    }

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: req.params.id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });

        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        const lastImage = [...chat.messages].reverse().find(m => m.imageUrl);
        const messages: ChatMessage[] = [];

        if (lastImage?.imageUrl) {
            const base64Url = await imageUrlToBase64(lastImage.imageUrl);
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: 'Here is the image I want you to modify:' },
                    { type: 'image_url', image_url: { url: base64Url } },
                ],
            });
        }

        messages.push({ role: 'user', content });

        // Generate new image with full history
        const data = await generateImage(content, undefined, model || chat.model, messages);

        const images = data.choices?.[0]?.message?.images;
        if (!images || images.length === 0) {
            throw new AppError('Model did not return an image. Try a different prompt.');
        }

        const base64Url = images[0].image_url.url;
        const filename = `${Date.now()}.png`;
        const s3ImageUrl = await uploadImage(base64Url, filename);

        // Only save both messages after generation succeeds
        await prisma.message.create({
            data: { chatId: chat.id, role: 'user', content },
        });

        const assistantMessage = await prisma.message.create({
            data: { chatId: chat.id, role: 'assistant', content: '', imageUrl: s3ImageUrl },
        });

        res.json(assistantMessage);
    } catch (error) {
        const { status, message } = toErrorResponse(error, 'Could not generate image. Please try again.');
        res.status(status).json({ error: message });
    }
});

export default router;
