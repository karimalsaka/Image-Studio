"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getChats } from "@/app/services/api";
import type { Chat } from "@/app/shared/types";

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getChats("demo-user")
      .then(setChats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load chats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight text-gray-900 mb-1">
        Chat History
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Your past image refinement conversations.
      </p>

      {error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No conversations yet.</p>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2"
          >
            Generate your first image
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
              className="block rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 hover:border-stone-300 hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-medium text-gray-900 truncate max-w-sm">
                  {chat.title}
                </h2>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {new Date(chat.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
