"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] text-gray-900 mb-4">
          Create something{" "}
          <span className="italic">beautiful</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10">
          Idea to image in seconds, with your personal AI artist
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-gray-900 text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
        >
          Start Generating
        </Link>
      </motion.div>
    </div>
  );
}
