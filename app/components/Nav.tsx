"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "@/app/components/AuthModal";

const publicNavItems = [
  { href: "/dashboard", label: "Generate" },
  { href: "/dashboard/about", label: "About" },
];

const authNavItems = [
  { href: "/dashboard", label: "Generate" },
  { href: "/dashboard/chat", label: "History" },
  { href: "/dashboard/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isHome = pathname === "/";
  const [showAuth, setShowAuth] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 h-14">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <Link href="/">
        <span className="font-display font-semibold text-[17px] text-[var(--text-primary)] tracking-tight">
          Image Studio
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {isHome ? (
          <Link
            href="/dashboard"
            className="bg-[var(--accent)] text-[var(--accent-text)] text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
          >
            Get Started
          </Link>
        ) : (
          <>
            {(user ? authNavItems : publicNavItems).map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    isActive
                      ? "text-[var(--text-primary)] bg-[var(--surface-inset)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="w-px h-4 bg-[var(--border)] mx-2" />
            {user ? (
              <button
                onClick={logout}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
