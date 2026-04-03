"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/shared/types";
import ImageLightbox from "@/app/components/ImageLightbox";

export default function ChatThread({ messages, isGenerating }: { messages: Message[]; isGenerating?: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <div className="space-y-6">
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === "user" ? (
            <div className="flex justify-end">
              <div className="max-w-[70%] rounded-2xl bg-[var(--surface-inset)] border border-[var(--border)] px-4 py-3 text-[15px] text-[var(--text-primary)] leading-relaxed">
                {msg.content}
              </div>
            </div>
          ) : (
            <div>
              {msg.imageUrl ? (
                <ImageLightbox
                  src={msg.imageUrl}
                  alt="Generated image"
                  className="max-w-full max-h-[500px] object-contain animate-image-reveal block rounded-xl"
                />
              ) : (
                <div className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {msg.content || "Image generation failed."}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isGenerating && (
        <div className="flex items-start gap-4 py-2">
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl px-5 py-4 shadow-sm shadow-black/3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin shrink-0" />
              <span className="text-[14px] text-[var(--text-secondary)]">Generating image...</span>
            </div>
            <div className="mt-3 w-48 h-32 rounded-lg bg-[var(--surface-inset)] shimmer" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
