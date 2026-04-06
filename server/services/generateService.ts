import { generateImage } from './openrouter';
import { uploadImage } from './storage';
import { AppError } from '../errors';

const MODEL_LABELS: Record<string, string> = {
    'google/gemini-2.5-flash-image': 'Nano Banana (Gemini 2.5 Flash)',
    'google/gemini-3.1-flash-image-preview': 'Nano Banana 2 (Gemini 3.1 Flash)',
    'google/gemini-3-pro-image-preview': 'Nano Banana Pro (Gemini 3 Pro)',
    'openai/gpt-5-image-mini': 'GPT-5 Image Mini',
    'openai/gpt-5-image': 'GPT-5 Image',
};

export interface GenerateResult {
    type: 'image';
    model: string;
    modelLabel: string;
    imageUrl: string;
}

export interface GenerateError {
    type: 'error';
    model: string;
    modelLabel: string;
    error: string;
}

export type GenerateEvent = GenerateResult | GenerateError;

function getLabel(model: string): string {
    return MODEL_LABELS[model] || model;
}

export async function generateForModel(
    prompt: string,
    size: string | undefined,
    model: string,
): Promise<GenerateEvent> {
    try {
        const data = await generateImage(prompt, size, model);
        const images = data.choices?.[0]?.message?.images;
        if (!images || images.length === 0) {
            throw new AppError('Model did not return an image.');
        }
        const base64ImageUrl = images[0].image_url.url;
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
        const imageUrl = await uploadImage(base64ImageUrl, filename);

        return { type: 'image', model, modelLabel: getLabel(model), imageUrl };
    } catch (err) {
        const message = err instanceof AppError ? err.message : 'Generation failed';
        return { type: 'error', model, modelLabel: getLabel(model), error: message };
    }
}
