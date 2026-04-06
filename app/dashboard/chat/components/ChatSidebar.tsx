"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getChats, deleteChat } from "@/app/services/api/chats";
import type { Chat } from "@/app/shared/types";
import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "@/app/components/AuthModal";

export default function ChatSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getChats()
      .then(setChats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const activeChatId = pathname.split("/dashboard/chat/")[1];

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingId(chatId);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;

    setDeletingId(chatId);
    setConfirmingId(null);
    try {
      await deleteChat(chatId);
      const remaining = chats.filter((c) => c.id !== chatId);
      setChats(remaining);
      if (chatId === activeChatId) {
        if (remaining.length > 0) {
          router.push(`/dashboard/chat/${remaining[0].id}`);
        } else {
          router.push("/dashboard/chat");
        }
      }
    } catch {
      // silently fail — chat stays in list
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingId(null);
  };

  return (
    <aside className="w-[280px] shrink-0 border-r border-[var(--border)] h-[calc(100vh-56px)] flex flex-col bg-[var(--surface)]">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

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
        {!user ? (
          <div className="px-2 py-8 text-center">
            <p className="text-[var(--text-tertiary)] text-[13px] mb-3">
              Please log in to see your chats
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="text-[12px] font-medium text-[var(--text-primary)] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>
        ) : loading ? (
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
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
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
                  {confirmingId === chat.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleConfirmDelete(e, chat.id)}
                        className="text-[11px] font-medium text-red-500 hover:text-red-600 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="text-[11px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : deletingId === chat.id ? (
                    <div className="w-3 h-3 rounded-full border border-[var(--text-tertiary)] border-t-[var(--text-primary)] animate-spin shrink-0" />
                  ) : (
                    <button
                      onClick={(e) => handleDeleteClick(e, chat.id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shrink-0 cursor-pointer"
                      title="Delete chat"
                    >
                      <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
