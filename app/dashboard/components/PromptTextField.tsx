"use client"

export default function PromptTextField( {prompt, onPromptChanged} :{prompt: string, onPromptChanged: (value: string) => void }) {
    return(
        <input 
            type = "text"
            value = {prompt}
            onChange={(e) => { onPromptChanged(e.target.value)}}
            placeholder="Describe the image you want..."
            className="w-full flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
        ></input>
    )
}