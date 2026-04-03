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
      <div className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center max-w-sm">
        <p className="text-red-600 text-sm font-medium mb-1">Something went wrong</p>
        <p className="text-red-500 text-xs mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
