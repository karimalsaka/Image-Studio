"use client";

import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  className?: string;
  onRefine?: () => void;
}

export default function ImageLightbox({ src, alt = "", className = "", onRefine }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="rounded-2xl max-w-full max-h-[90vh] object-contain animate-image-reveal shadow-2xl"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {onRefine && (
                <button
                  onClick={() => { setOpen(false); onRefine(); }}
                  className="h-8 px-4 rounded-full bg-white text-[13px] font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-white/90 transition-colors shadow-lg"
                >
                  Refine
                </button>
              )}
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="h-8 px-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-[13px] font-medium text-white hover:bg-white/30 transition-colors flex items-center gap-1.5"
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
    </>
  );
}
