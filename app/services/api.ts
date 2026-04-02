import { ApiError } from "./errors";

const API_URL = 'http://localhost:4000';

export async function generateImage(prompt: string) {
    const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    })


    if (!response.ok) {
        const errorData = await response.json()

        throw new ApiError(errorData.error || 'Failed to generate image', response.status)
    }

    return response.json()
}