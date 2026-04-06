"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getChats } from "@/app/services/api/chats";
import type { Chat } from "@/app/shared/types";
import { useAuth } from "@/app/context/AuthContext";

export default function RecentChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getChats()
      .then((data) => setChats(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading || !user || chats.length === 0) return null;

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium text-[var(--text-primary)]">
          Recent Generations
        </h2>
        <Link
          href="/dashboard/chat"
          className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
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
                  <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="px-2.5 py-2">
              <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                {chat.title}
              </p>
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
    </div>
  );
}
