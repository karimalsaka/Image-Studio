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

      // Optimistic user message
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
        // Roll back the optimistic message
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  if (!chat && error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-sm">{error}</p>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 mt-4 inline-block"
        >
          Back to Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-136px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          <h1 className="font-display text-lg font-medium text-gray-900 truncate max-w-xs">
            {chat?.title}
          </h1>
        </div>
        <Dropdown options={MODELS} value={model} onChange={setModel} />
      </div>

      {/* Messages */}
      <ChatThread messages={messages} />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 mb-3">
          <svg
            className="w-4 h-4 text-red-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
