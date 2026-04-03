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
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-medium tracking-tight text-[var(--text-primary)] mb-1">
        History
      </h1>
      <p className="text-[var(--text-tertiary)] text-sm mb-8">
        Your past image refinement conversations.
      </p>

      {error ? (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-tertiary)] text-sm mb-4">No conversations yet.</p>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--text-primary)] hover:underline"
          >
            Generate your first image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
              className="group rounded-xl overflow-hidden bg-[var(--surface-inset)] hover:shadow-md hover:shadow-black/5 transition-all"
            >
              <div className="aspect-square overflow-hidden">
                {chat.thumbnail ? (
                  <img
                    src={chat.thumbnail}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="px-2.5 py-2">
                <h2 className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                  {chat.title}
                </h2>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  {new Date(chat.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
