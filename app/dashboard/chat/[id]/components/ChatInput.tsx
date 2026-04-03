"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Describe changes to the image..."
        disabled={disabled}
        rows={1}
        className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-none outline-none resize-none text-[#1a1a1a] text-[15px] leading-relaxed placeholder:text-[#a09a94]"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
      >
        {disabled ? (
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
  );
}
