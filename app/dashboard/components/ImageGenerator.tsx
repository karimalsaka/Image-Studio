"use client"

import { useState } from "react"
import PromptTextField from "./PromptTextField"
import { generateImage } from "@/app/services/api"
import { ApiError } from '@/app/services/errors'

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        setIsLoading(true)
         try {
            let data = await generateImage(prompt)
            setImageUrl(data.choices[0].message.images[0].image_url.url);
        } catch (error) {
            if (error instanceof ApiError) {
                console.error(`Error ${error.status}: ${error.message}`)
                setError(error.message)
            }
         } finally {
            setIsLoading(false)
         }
    }

    return (
        <div className="space-y-4">
            <div className ="flex gap-4 items-start" >
                <div className="flex-1">
                    <PromptTextField
                        prompt={prompt}
                        onPromptChanged={value => {
                            setError('')
                            setPrompt(value)
                        }}
                    ></PromptTextField>

                { error && <p className="text-red-400  mt-2">`Failed with error: ${error}`</p>}

                </div>

                <button
                        onClick={handleGenerate}
                        disabled={!prompt || isLoading}
                        className="text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-blue-600 disabled:bg-gray-600"
                        >
                    {isLoading ? 'Generating...' : 'Generate'}
                    </button>

            </div>

            {
            imageUrl && <img
                src={imageUrl}
                alt={prompt}
                className="rounded-lg max-w-lg"
            ></img>
            }
        </div>
    );
}