"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getChats } from "@/app/services/api";
import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "@/app/components/AuthModal";

export default function ChatIndexPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [empty, setEmpty] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setEmpty(true); return; }

    getChats().then((chats) => {
      if (chats.length > 0) {
        router.replace(`/dashboard/chat/${chats[0].id}`);
      } else {
        setEmpty(true);
      }
    }).catch(() => setEmpty(true));
  }, [router, user, authLoading]);

  if (empty && !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        <div className="text-center">
          <p className="text-[var(--text-tertiary)] text-sm mb-3">Please log in to see your chats</p>
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-[var(--text-primary)] hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

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
