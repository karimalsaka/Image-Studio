"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/shared/types";
import ImageLightbox from "@/app/components/ImageLightbox";

export default function ChatThread({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div ref={bottomRef} />
    </div>
  );
}
