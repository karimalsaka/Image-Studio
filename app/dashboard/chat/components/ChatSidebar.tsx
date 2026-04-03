"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getChats } from "@/app/services/api";
import type { Chat } from "@/app/shared/types";

export default function ChatSidebar() {
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChats("demo-user")
      .then(setChats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeChatId = pathname.split("/dashboard/chat/")[1];

  return (
    <aside className="w-[280px] shrink-0 border-r border-[var(--border)] h-[calc(100vh-56px)] flex flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[var(--text-primary)] tracking-tight">
          Conversations
        </span>
        <Link
          href="/dashboard"
          className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          + New
        </Link>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-4 h-4 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="px-2 py-8 text-center">
            <p className="text-[var(--text-tertiary)] text-[13px] mb-2">No conversations yet</p>
            <Link
              href="/dashboard"
              className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Generate your first image
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <Link
                  key={chat.id}
                  href={`/dashboard/chat/${chat.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[var(--surface-raised)] border border-[var(--border)] shadow-sm shadow-black/3"
                      : "border border-transparent hover:bg-[var(--surface-inset)]"
                  }`}
                >
                  {chat.thumbnail ? (
                    <img
                      src={chat.thumbnail}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-inset)] shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13px] truncate leading-tight ${
                      isActive
                        ? "text-[var(--text-primary)] font-medium"
                        : "text-[var(--text-secondary)]"
                    }`}>
                      {chat.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
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
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
