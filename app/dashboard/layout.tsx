import Link from 'next/link'
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
          <nav className="flex items-center gap-6 px-8 py-4 bg-gray-900 border-b border-gray-800 justify-between">
            <h2 className="text-white font-bold text-lg mr-4">Image Studio</h2>
            <div className="flex gap-6">    
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                Dashboard
                </Link>
                <Link href="/dashboard/about" className="text-gray-400 hover:text-white transition">
                About
                </Link>
            </div>
          </nav>
          <main className="p-8">
            {children}
          </main>
        </div>
      );
}