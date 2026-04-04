"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChats } from "@/app/services/api";

export default function ChatIndexPage() {
  const router = useRouter();
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    getChats("demo-user").then((chats) => {
      if (chats.length > 0) {
        router.replace(`/dashboard/chat/${chats[0].id}`);
      } else {
        setEmpty(true);
      }
    }).catch(() => setEmpty(true));
  }, [router]);

  if (empty) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-tertiary)] text-sm mb-2">No conversations yet</p>
          <a
            href="/dashboard"
            className="text-sm font-medium text-[var(--text-primary)] hover:underline"
          >
            Generate your first image
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-[var(--text-primary)] animate-spin" />
    </div>
  );
}
