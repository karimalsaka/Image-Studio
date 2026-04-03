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
    <nav className="flex items-center justify-between px-6 h-14">
      <Link href="/">
        <span className="font-display font-semibold text-lg text-gray-900">Image Studio</span>
      </Link>

      <div className="flex items-center gap-1">
        {isHome ? (
          <Link
            href="/dashboard"
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        ) : (
          navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-gray-900 bg-white/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/30"
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
