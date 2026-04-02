import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { generateImage } from './services/openrouter'

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

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000')
});
