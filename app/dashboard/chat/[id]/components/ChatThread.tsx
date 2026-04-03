"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/shared/types";

export default function ChatThread({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pb-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "user" ? (
            <div className="max-w-[80%] rounded-2xl bg-gray-900 text-white px-4 py-3 text-[15px] leading-relaxed">
              {msg.content}
            </div>
          ) : (
            <div className="max-w-lg">
              {msg.imageUrl ? (
                <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 p-2">
                  <img
                    src={msg.imageUrl}
                    alt="Generated image"
                    className="rounded-xl max-w-full animate-image-reveal block"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-stone-100 px-4 py-3 text-[15px] text-gray-700 leading-relaxed">
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
