"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PromptTextField from "./PromptTextField";
import Dropdown from "@/app/components/Dropdown";
import ModelPicker from "@/app/components/ModelPicker";
import { generateImageStream, type StreamEvent } from "@/app/services/api/generate";
import { createChat } from "@/app/services/api/chats";
import { ApiError } from "@/app/services/errors";
import { MODELS, SIZES } from "@/app/shared/constants";
import ImageLightbox from "@/app/components/ImageLightbox";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "@/app/context/AuthContext";

const suggestions = [
  { emoji: "🏔", label: "Misty mountain cabin at golden hour" },
  { emoji: "🐉", label: "A dragon made entirely of stained glass with sunlight pouring through its wings" },
  { emoji: "🌌", label: "Astronaut drifting through a jellyfish-shaped nebula" },
  { emoji: "🎭", label: "Venetian mask melting into liquid gold, dark moody background, dramatic studio lighting" },
  { emoji: "🌊", label: "Lighthouse in a violent storm, oil painting" },
  { emoji: "🏛", label: "Ancient temple overgrown with bioluminescent vines at night" },
];

interface ImageSlot {
  model: string;
  modelLabel: string;
  imageUrl?: string;
  error?: string;
}

export default function Studio() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState([MODELS[0].id]);
  const [imageSize, setImageSize] = useState(SIZES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [error, setError] = useState("");
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    if (!user) { setShowAuth(true); return; }

    setIsLoading(true);
    setError("");

    // Create placeholder slots — one per selected model
    const initialSlots: ImageSlot[] = selectedModels.map((id) => ({
      model: id,
      modelLabel: MODELS.find((m) => m.id === id)?.label || id,
    }));
    setSlots(initialSlots);

    try {
      await generateImageStream(prompt, imageSize, selectedModels, (event: StreamEvent) => {
        setSlots((prev) =>
          prev.map((slot) => {
            if (slot.model !== event.model) return slot;
            if (event.type === "image") {
              return { ...slot, imageUrl: event.imageUrl, modelLabel: event.modelLabel };
            }
            return { ...slot, error: event.error, modelLabel: event.modelLabel };
          })
        );
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (slot: ImageSlot, index: number) => {
    if (refiningIndex !== null || !slot.imageUrl) return;
    if (!user) { setShowAuth(true); return; }

    setRefiningIndex(index);
    try {
      const chat = await createChat(prompt, slot.model, slot.imageUrl);
      router.push(`/dashboard/chat/${chat.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start refinement session.");
      setRefiningIndex(null);
    }
  };

  const hasResults = slots.length > 0;

  return (
    <div className="space-y-4">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Prompt card */}
      <div className="bg-[var(--surface-raised)] rounded-2xl border border-[var(--border)] p-5 shadow-sm shadow-black/3">
        <PromptTextField
          prompt={prompt}
          onPromptChanged={(value) => {
            setError("");
            setPrompt(value);
          }}
          onSubmit={handleGenerate}
          disabled={isLoading}
        />

        <div className="flex items-center justify-end gap-1.5 mt-2">
          <ModelPicker selected={selectedModels} onChange={setSelectedModels} />
          <Dropdown options={SIZES} value={imageSize} onChange={setImageSize} />

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0 ml-1"
          >
            {isLoading ? (
              <span className="loading-dots flex items-center gap-0.5 text-[var(--accent-text)]">
                <span></span>
                <span></span>
                <span></span>
              </span>
            ) : (
              <svg className="w-3.5 h-3.5 text-[var(--accent-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => setPrompt(label)}
            className="group flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:shadow-sm hover:shadow-black/3 transition-all cursor-pointer text-left"
          >
            <span className="text-base leading-none mt-0.5">{emoji}</span>
            <span className="text-[12px] leading-snug text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-2">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Image grid — shows slots (loading or loaded) */}
      {hasResults && (
        <div className="grid grid-cols-3 gap-2.5">
          {slots.map((slot, i) => (
            <div
              key={slot.model}
              className="rounded-xl overflow-hidden group relative bg-[var(--surface-inset)]"
            >
              <div className="aspect-square overflow-hidden">
                {slot.imageUrl ? (
                  <ImageLightbox
                    src={slot.imageUrl}
                    alt={`${prompt} — ${slot.modelLabel}`}
                    className="w-full h-full object-cover animate-image-reveal block hover:scale-[1.03] transition-transform duration-300"
                    onRefine={() => handleRefine(slot, i)}
                  />
                ) : slot.error ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <p className="text-red-400 text-[12px] text-center">{slot.error}</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center shimmer">
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin mx-auto mb-2" />
                      <p className="text-[var(--text-tertiary)] text-[11px]">Generating...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Model label — always visible */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[var(--text-secondary)]">
                  {slot.modelLabel}
                </span>
              </div>

              {/* Hover actions — only when image is loaded */}
              {slot.imageUrl && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRefine(slot, i)}
                      disabled={refiningIndex !== null}
                      className="h-7 px-2.5 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[11px] font-semibold text-[var(--text-primary)] cursor-pointer disabled:opacity-50 hover:bg-white transition-colors"
                    >
                      {refiningIndex === i ? "Opening..." : "Refine"}
                    </button>
                    <a
                      href={slot.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg className="w-3 h-3 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
