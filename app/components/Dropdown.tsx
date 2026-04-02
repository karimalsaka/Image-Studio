"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ options, value, onChange }: DropdownProps) {
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

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-stone-200 bg-white text-[13px] font-medium text-gray-700 hover:border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
      >
        {selected?.label}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 min-w-[180px] bg-white rounded-xl border border-stone-200 shadow-lg shadow-black/8 py-1 z-50 animate-in">
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[13px] transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "text-gray-900 font-medium bg-stone-50"
                    : "text-gray-600 hover:bg-stone-50 hover:text-gray-900"
                }`}
              >
                {option.label}
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
