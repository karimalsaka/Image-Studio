"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getChats } from "@/app/services/api";
import type { Chat } from "@/app/shared/types";

export default function RecentChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChats("demo-user")
      .then((data) => setChats(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || chats.length === 0) return null;

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-medium text-gray-900">
          Recent Generations
        </h2>
        <Link
          href="/dashboard/chats"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/dashboard/chat/${chat.id}`}
            className="group rounded-xl border border-stone-200 bg-stone-50 overflow-hidden hover:border-stone-300 hover:shadow-sm transition-all"
          >
            <div className="aspect-square bg-stone-100 overflow-hidden">
              {chat.thumbnail ? (
                <img
                  src={chat.thumbnail}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[13px] font-medium text-gray-900 truncate">
                {chat.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
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
