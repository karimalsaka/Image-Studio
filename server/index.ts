import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { generateImage } from './services/openrouter'
import prisma from './db'

dotenv.config({ path: './server/.env' });

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
    const { prompt, size, model } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" })
    }
    
    try {
        const data = await generateImage(prompt, size, model)
        res.json(data)
    } catch(error) {
        const message = error instanceof Error ? error.message : 'Failed to generate image';
        console.error('Error:', error)
        res.status(500).json({ error: message });    
    }
});

app.post('/api/chats', async (req, res) => {
    const { title, model, userId, imageUrl} = req.body

    const chat = await prisma.chat.create({
        data: {
            title, 
            model,
            userId,
            messages: {
                create: [
                    { role: 'user', content: title },
                    { role: 'assistant', content: '', imageUrl }
                ]
            }
        },
        include: {messages: true}
    })

    res.json(chat)
})

// Create a chat
app.post('/api/chats', async (req, res) => {
    const { title, model, userId, imageUrl } = req.body;

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
        console.error(error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});

// Get all chats for a user
app.get('/api/chats', async (req, res) => {
    const { userId } = req.query;

    try {
        const chats = await prisma.chat.findMany({
            where: { userId: userId as string },
            orderBy: { createdAt: 'desc' },
        });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

// Get a single chat with messages
app.get('/api/chats/:id', async (req, res) => {
    try {
        const chat = await prisma.chat.findUnique({
            where: { id: req.params.id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
});


  // Send a message in a chat
  app.post('/api/chats/:id/messages', async (req, res) => {
    const { content, model } = req.body;

    try {
        // Get existing messages for context
        const chat = await prisma.chat.findUnique({
            where: { id: req.params.id },
            include: { messages: { orderBy: { createdAt: 'asc' } } },
        });

        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        // Save user message
        await prisma.message.create({
            data: { chatId: chat.id, role: 'user', content },
        });

        // Build conversation history for the API
        const messages = chat.messages.map((m) => ({
            role: m.role,
            content: m.content,
        }));
        messages.push({ role: 'user', content });

        // Generate new image with full history
        const data = await generateImage(content, undefined, model || chat.model);

        const imageUrl = data.choices[0].message.images[0].image_url.url;

        // Save assistant response
        const assistantMessage = await prisma.message.create({
            data: { chatId: chat.id, role: 'assistant', content: '', imageUrl },
        });

        res.json(assistantMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});