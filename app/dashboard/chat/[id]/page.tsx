"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Dropdown from "@/app/components/Dropdown";
import { getChat, sendMessage } from "@/app/services/api";
import { ApiError } from "@/app/services/errors";
import { MODELS } from "@/app/shared/constants";
import type { Chat, Message } from "@/app/shared/types";
import ChatThread from "./components/ChatThread";
import ChatInput from "./components/ChatInput";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState(MODELS[0].id);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChat(id)
      .then((data: Chat) => {
        setChat(data);
        setMessages(data.messages);
        setModel(data.model);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load chat."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSend = useCallback(
    async (content: string) => {
      if (isSending) return;
      setIsSending(true);
      setError("");

      const tempId = `temp-${Date.now()}`;
      const tempUserMsg: Message = {
        id: tempId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      try {
        const assistantMsg = await sendMessage(id, content, model);
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to send message."
        );
      } finally {
        setIsSending(false);
      }
    },
    [id, model, isSending]
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin" />
      </div>
    );
  }

  if (!chat && error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm">{error}</p>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] mt-4 inline-block"
          >
            Back to Studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 h-12 border-b border-[var(--border)] shrink-0">
        <span className="text-[14px] font-medium text-[var(--text-primary)]">
          {chat?.title}
        </span>
        <Dropdown options={MODELS} value={model} onChange={setModel} direction="down" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 lg:px-16 py-6">
          <ChatThread messages={messages} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-8 lg:px-16">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 mb-3">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-red-500 text-[13px]">{error}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-8 lg:px-16 pb-5 pt-3 border-t border-[var(--border)]">
        <ChatInput onSend={handleSend} disabled={isSending} />
      </div>
    </div>
  );
}
