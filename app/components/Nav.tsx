"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Generate" },
  { href: "/dashboard/chats", label: "History" },
  { href: "/dashboard/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex items-center justify-between px-8 h-14">
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
          navItems.map(({ href, label }) => {
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
          })
        )}
      </div>
    </nav>
  );
}
