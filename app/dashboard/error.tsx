"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl px-8 py-6 text-center max-w-sm shadow-sm">
        <p className="text-[var(--text-primary)] text-sm font-medium mb-1">Something went wrong</p>
        <p className="text-[var(--text-tertiary)] text-xs mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="text-sm font-medium text-[var(--text-primary)] hover:underline cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
