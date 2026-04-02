"use client";

import { useState } from "react";
import PromptTextField from "./PromptTextField";
import { generateImage } from "@/app/services/api";
import { ApiError } from "@/app/services/errors";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await generateImage(prompt);
      setImageUrl(data.choices[0].message.images[0].image_url.url);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Error ${error.status}: ${error.message}`);
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt card */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm">
        <PromptTextField
          prompt={prompt}
          onPromptChanged={(value) => {
            setError("");
            setPrompt(value);
          }}
          onSubmit={handleGenerate}
          disabled={isLoading}
        />

        <div className="flex items-center justify-end mt-3 pt-3 border-t border-stone-200">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="bg-gray-900 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                Generating
                <span className="loading-dots flex items-center gap-0.5">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-gray-900 animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Creating your image...</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated image */}
      {imageUrl && !isLoading && (
        <div className="rounded-2xl border border-stone-200 overflow-hidden group relative bg-stone-50 p-2 mx-auto w-fit">
          <img
            key={imageUrl}
            src={imageUrl}
            alt={prompt}
            className="rounded-xl max-w-lg animate-image-reveal block"
          />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
