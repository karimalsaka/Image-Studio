"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PromptTextField from "./PromptTextField";
import Dropdown from "@/app/components/Dropdown";
import { generateImage, createChat } from "@/app/services/api";
import { ApiError } from "@/app/services/errors";
import { MODELS, SIZES, COUNTS } from "@/app/shared/constants";

const suggestions = [
  {
    icon: (
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
    label: "Oil painting landscape",
  },
  {
    icon: (
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z" />
      </svg>
    ),
    label: "Product photography",
  },
  {
    icon: (
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
      </svg>
    ),
    label: "Abstract wallpaper",
  },
  {
    icon: (
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09zm8.446-7.189L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456z" />
      </svg>
    ),
    label: "Fantasy character",
  },
];

export default function Studio() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [imageSize, setImageSize] = useState(SIZES[0].id);
  const [imageCount, setImageCount] = useState(COUNTS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    setImageUrls([]);
    try {
      const data = await generateImage(prompt, imageSize, model, Number(imageCount));
      setImageUrls(data.imageUrls);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Error ${error.status}: ${error.message}`);
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (url: string, index: number) => {
    if (refiningIndex !== null) return;
    setRefiningIndex(index);
    try {
      const chat = await createChat(prompt, model, "demo-user", url);
      router.push(`/dashboard/chat/${chat.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start refinement session.");
      setRefiningIndex(null);
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

        <div className="flex items-center justify-end gap-2 mt-2">
          <Dropdown options={MODELS} value={model} onChange={setModel} />
          <Dropdown options={SIZES} value={imageSize} onChange={setImageSize} />
          <Dropdown options={COUNTS} value={imageCount} onChange={setImageCount} />

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isLoading ? (
              <span className="loading-dots flex items-center gap-0.5 text-white">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap gap-2.5">
        {suggestions.map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => setPrompt(label)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-gray-700 text-[13px] font-medium hover:border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {icon}
            {label}
          </button>
        ))}
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
              <p className="text-gray-400 text-sm">
                Creating {Number(imageCount) > 1 ? `${imageCount} images` : "your image"}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated images */}
      {imageUrls.length > 0 && !isLoading && (
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.map((url, i) => (
            <div
              key={url}
              className="rounded-2xl border border-stone-200 overflow-hidden group relative bg-stone-50 p-2"
            >
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src={url}
                  alt={`${prompt} (${i + 1})`}
                  className="w-full h-full object-cover animate-image-reveal block cursor-pointer"
                  onClick={() => setLightboxUrl(url)}
                />
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRefine(url, i)}
                  disabled={refiningIndex !== null}
                  className="h-8 px-3 rounded-full bg-white border border-stone-200 flex items-center gap-1.5 hover:bg-stone-50 transition-colors shadow-sm text-[13px] font-medium text-gray-700 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
                  </svg>
                  {refiningIndex === i ? "Opening..." : "Refine"}
                </button>
                <a
                  href={url}
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
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxUrl}
              alt={prompt}
              className="rounded-2xl max-w-full max-h-[90vh] object-contain animate-image-reveal"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => {
                  const idx = imageUrls.indexOf(lightboxUrl);
                  setLightboxUrl(null);
                  handleRefine(lightboxUrl, idx !== -1 ? idx : 0);
                }}
                disabled={refiningIndex !== null}
                className="h-9 px-4 rounded-full bg-white/90 flex items-center gap-1.5 hover:bg-white transition-colors text-[13px] font-medium text-gray-700 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
                </svg>
                Refine
              </button>
              <a
                href={lightboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="h-9 px-4 rounded-full bg-white/90 flex items-center gap-1.5 hover:bg-white transition-colors text-[13px] font-medium text-gray-700"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
