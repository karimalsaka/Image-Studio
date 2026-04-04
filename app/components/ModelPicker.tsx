"use client";

import { useState, useRef, useEffect } from "react";
import { MODELS } from "@/app/shared/constants";

interface ModelPickerProps {
  selected: string[];
  onChange: (models: string[]) => void;
  direction?: "up" | "down";
}

export default function ModelPicker({ selected, onChange, direction = "up" }: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return; // must keep at least one
      onChange(selected.filter((m) => m !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const label = selected.length === 1
    ? MODELS.find((m) => m.id === selected[0])?.label
    : `${selected.length} models`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--surface-inset)] text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
      >
        {label}
        <svg
          className={`w-3 h-3 text-[var(--text-tertiary)] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className={`absolute ${direction === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5"} right-0 min-w-[220px] bg-[var(--surface-raised)] rounded-xl border border-[var(--border)] shadow-lg shadow-black/6 py-1 z-50 animate-in`}>
          <div className="px-3.5 py-2 text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            Select models
          </div>
          {MODELS.map((model) => {
            const isSelected = selected.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggle(model.id)}
                className={`w-full text-left px-3.5 py-2 text-[13px] transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)]"
                }`}
              >
                {model.label}
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[var(--accent)] border-[var(--accent)]"
                    : "border-[var(--border)]"
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-[var(--accent-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
