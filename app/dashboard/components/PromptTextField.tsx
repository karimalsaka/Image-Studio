"use client";

export default function PromptTextField({
  prompt,
  onPromptChanged,
  onSubmit,
  disabled,
}: {
  prompt: string;
  onPromptChanged: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
}) {
  return (
    <textarea
      value={prompt}
      onChange={(e) => onPromptChanged(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !disabled && onSubmit) {
          e.preventDefault();
          onSubmit();
        }
      }}
      placeholder="Describe the image you want to create..."
      className="w-full min-h-[80px] max-h-[160px] bg-transparent border-none outline-none resize-none text-[var(--text-primary)] text-[15px] leading-relaxed placeholder:text-[var(--text-tertiary)]"
      rows={3}
      disabled={disabled}
    />
  );
}
